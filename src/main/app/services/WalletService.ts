/*eslint-disable*/

import AgentWalletRepository from "../repositories/AgentWalletRepository";
import {
    CreateWalletRequest,
    IntraWalletTransactionRequest,
    WalletTransactionRequest
} from "../payloads/RequestPayload";
import {
    ApiResponse,
    InterWalletTransferReceipt,
    DirectTransferInstructions,
    WalletTransactionData
} from "../payloads/ResponsePayload";
import AgentWallet from "../models/AgentWallet";
import Agent from "../models/Agent";
import { HttpStatus, Injectable } from "@nestjs/common";
import WalletValidatorService, { InterWalletValidationDetails } from "./WalletValidatorService";
import AppHelper from "../utils/AppHelper";
import { Currency } from "../commons/Currency";
import { WalletStatus } from "../commons/WalletStatus";
import { EntityManager } from "typeorm";
import AgentWalletTransaction from "../models/AgentWalletTransaction";
import { PaymentGateway } from "../commons/PaymentGateway";
import { TransactionType } from "../commons/TransactionType";
import { TransactionStatus } from "../commons/TransactionStatus";
import AgentWalletTransactionRepository from "../repositories/AgentWalletTransactionRepository";
import ApiException from "../exceptions/ApiException";



@Injectable()
export default class WalletService{

    constructor(
      private readonly walletRepository: AgentWalletRepository,
      private readonly walletValidatorService: WalletValidatorService,
      private readonly walletTransactionRepository: AgentWalletTransactionRepository
    ) {}

    async processWalletCreation(requestPayload: CreateWalletRequest): Promise<ApiResponse<WalletTransactionData>>{
        const validAgent: Agent = await this.walletValidatorService.validateAgentWalletCreationRequest(requestPayload);
        const createdWallet : AgentWallet = await this.createNewWalletForAgent(validAgent);
        const responseData: WalletTransactionData = WalletTransactionData.fromWallet(createdWallet);
        return Promise.resolve(new ApiResponse(HttpStatus.OK, "Successful creation of agent wallet", responseData));
    }

    async processWalletFunding(requestPayload: WalletTransactionRequest): Promise<ApiResponse<WalletTransactionData>> {
        const agent: Agent = await this.walletValidatorService.validateAgentWalletForTransaction(requestPayload);
        const walletData: WalletTransactionData = await this.getLocallyUpdatedWalletData({
            amount: requestPayload.amount,
            narration: requestPayload.narration,
            agent: agent,
            transactionType: TransactionType.INFLOW,
            paymentGateway: PaymentGateway.LOCAL,
            transactionStatus: TransactionStatus.COMPLETED,
            requestId: requestPayload.requestId
        });
        return Promise.resolve(new ApiResponse(HttpStatus.OK, "Successful funding of agent wallet", walletData));
    }

    async processWalletWithdrawal(requestPayload: WalletTransactionRequest): Promise<ApiResponse<WalletTransactionData>> {
        const agent: Agent = await this.walletValidatorService.validateAgentWalletForTransaction(requestPayload);
        const walletData: WalletTransactionData = await this.getLocallyUpdatedWalletData({
            amount: requestPayload.amount,
            narration: requestPayload.narration,
            agent: agent,
            transactionType: TransactionType.OUTFLOW,
            paymentGateway: PaymentGateway.LOCAL,
            transactionStatus: TransactionStatus.COMPLETED,
            requestId: requestPayload.requestId
        });
        return Promise.resolve(new ApiResponse(HttpStatus.OK, "Successful withdrawal of agent wallet", walletData));
    }

    async processIntraWalletTransfer(requestPayload: IntraWalletTransactionRequest): Promise<InterWalletTransferReceipt>{
        const validationDetails: InterWalletValidationDetails = await this.walletValidatorService.validateRequestForInterWalletTransaction(requestPayload);
        return await this.processInterWalletUpdateAndReceipt(requestPayload, validationDetails.sourceAgent, validationDetails.destinationAgent);
    }


    private async processInterWalletUpdateAndReceipt(requestPayload: IntraWalletTransactionRequest, agent: Agent, beneficialAgent: Agent): Promise<InterWalletTransferReceipt>{
        return await this.walletRepository.manager.transaction(async (entityManager: EntityManager): Promise<InterWalletTransferReceipt> => {
           const agentWallet: AgentWallet =  await entityManager.getRepository(AgentWallet).findOne({ where: { agent: agent }, lock: { mode: 'pessimistic_write'}});
           const beneficialWallet: AgentWallet = await entityManager.getRepository(AgentWallet).findOne({ where: { agent: beneficialAgent }, lock: { mode: 'pessimistic_write'}});

           agentWallet.balance -= requestPayload.amount;
           await this.walletRepository.save(agentWallet);

           beneficialWallet.balance += requestPayload.amount;
           await this.walletRepository.save(beneficialWallet);

            const fundTransaction: AgentWalletTransaction = new AgentWalletTransaction();
            fundTransaction.agent = agent;
            fundTransaction.beneficialAgentWalletId = beneficialWallet.walletId;
            fundTransaction.beneficiaryName = agent.username;
            fundTransaction.beneficiaryEmail = agent.emailAddress;
            fundTransaction.requestId = requestPayload.requestId;
            fundTransaction.transactionId = AppHelper.generateSequence(20);
            fundTransaction.amount = requestPayload.amount;
            fundTransaction.walletBalance = agentWallet.balance;
            fundTransaction.paymentGateway = PaymentGateway.LOCAL;
            fundTransaction.transactionType = TransactionType.INTER_WALLET;
            fundTransaction.drCr = 'D';
            fundTransaction.status = TransactionStatus.COMPLETED;
            fundTransaction.narration = requestPayload.narration;
            fundTransaction.createdAt = new Date();
            fundTransaction.updatedAt = fundTransaction.createdAt;
            await this.walletTransactionRepository.save(fundTransaction);
           return InterWalletTransferReceipt.fromWallet(agentWallet, beneficialAgent);
        });
    }

    private async getLocallyUpdatedWalletData(requestPayload: LocalWalletUpdateRequest): Promise<WalletTransactionData> {
        const agent: Agent = requestPayload.agent;
        try {
            return await this.walletRepository.manager.transaction(async (entityManager: EntityManager): Promise<WalletTransactionData> => {
                const wallet: AgentWallet = await entityManager.getRepository(AgentWallet).findOne({
                    where: { agent: agent },
                    lock: { mode: 'pessimistic_write' }
                });
                if(requestPayload.transactionType === TransactionType.INFLOW) {
                    wallet.balance += requestPayload.amount;
                }
                else if(requestPayload.transactionType === TransactionType.OUTFLOW){
                    wallet.balance -= requestPayload.amount;
                }
                await this.walletRepository.save(wallet);

                requestPayload.agentWallet = wallet;
                requestPayload.beneficialEmail = agent.emailAddress;
                requestPayload.beneficialName = agent.username;
                await this.persistWalletTransactionRecord(requestPayload);
                return WalletTransactionData.fromWallet(wallet, requestPayload.transactionStatus);
            });
        }catch (error){
            ApiException.throwNewInstance(HttpStatus.INTERNAL_SERVER_ERROR, error);
        }
    }

    private async persistWalletTransactionRecord(requestPayload: LocalWalletUpdateRequest): Promise<void> {
        const fundTransaction: AgentWalletTransaction = new AgentWalletTransaction();
        fundTransaction.agent = requestPayload.agent;
        fundTransaction.beneficiaryName = requestPayload.beneficialName;
        fundTransaction.beneficiaryEmail = requestPayload.beneficialEmail;
        fundTransaction.requestId = requestPayload.requestId;
        fundTransaction.transactionId = AppHelper.generateSequence(20);
        fundTransaction.amount = requestPayload.amount;
        fundTransaction.walletBalance = requestPayload.agentWallet.balance;
        fundTransaction.paymentGateway = requestPayload.paymentGateway;
        fundTransaction.transactionType = requestPayload.transactionType;
        fundTransaction.drCr = requestPayload.transactionType == TransactionType.INFLOW ? 'C' : 'D';
        fundTransaction.status = requestPayload.transactionStatus;
        fundTransaction.narration = requestPayload.narration;
        fundTransaction.createdAt = new Date();
        fundTransaction.updatedAt = fundTransaction.createdAt;
        await this.walletTransactionRepository.save(fundTransaction);
    }

    private async createNewWalletForAgent(validAgent: Agent): Promise<AgentWallet> {
        const wallet: AgentWallet = new AgentWallet();
        wallet.walletId = await this.createWalletId();
        wallet.slug = AppHelper.generateUUID();
        wallet.balance = 0.0;
        wallet.status = WalletStatus.ACTIVE;
        wallet.currency = Currency.NGN;
        wallet.agent = validAgent;
        wallet.createdAt = new Date();
        wallet.updatedAt = wallet.createdAt;
        return this.walletRepository.save(wallet);
    }

    private async createWalletId(): Promise<string> {
        const trialTimes : number = 10;
        for(let i: number = 0; i < trialTimes; i++){
            const walletId: string = String(new Date().getTime());
            const existingWalletById: boolean = await this.walletRepository.exists({ where: { walletId: walletId }});
            if(!existingWalletById){
                return walletId;
            }
        }
        return AppHelper.generateSequence(13);
    }
}

export interface LocalWalletUpdateRequest{
    amount: number;
    narration: string;
    agent: Agent,
    agentWallet?: AgentWallet,
    beneficialEmail?: string;
    beneficialName?: string;
    transactionType: TransactionType,
    paymentGateway: PaymentGateway,
    transactionStatus: TransactionStatus,
    requestId: string;
}