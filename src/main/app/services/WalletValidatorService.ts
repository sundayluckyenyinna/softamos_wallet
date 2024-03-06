/*eslint-disable*/

import {
  CreateWalletRequest,
  IntraWalletTransactionRequest,
  WalletTransactionRequest
} from "../payloads/RequestPayload";
import Agent from "../models/Agent";
import AgentWallet from "../models/AgentWallet";
import ApiException from "../exceptions/ApiException";
import { HttpStatus, Injectable } from "@nestjs/common";
import AgentRepository from "../repositories/AgentRepository";
import AgentWalletRepository from "../repositories/AgentWalletRepository";
import { AgentStatus } from "../commons/AgentStatus";
import { WalletStatus } from "../commons/WalletStatus";

@Injectable()
export default class WalletValidatorService {

    constructor(
      private readonly agentRepository: AgentRepository,
      private readonly walletRepository: AgentWalletRepository
    ) {}


    public async validateAgentWalletCreationRequest(requestPayload: CreateWalletRequest): Promise<Agent> {
      const agent: Agent = await this.agentRepository.findOne({ where: { mobileNumber: '07035413942' }});
      const wallet: AgentWallet = await this.walletRepository.findOne({ where: { agent:  agent}});
      if(wallet){
        ApiException.throwNewInstance(HttpStatus.CONFLICT, `Agent with mobileNumber ${requestPayload.agentMobileNumber} already has a wallet`);
      }
      return Promise.resolve(agent);
    }

    public async validateAgentWalletForTransaction(requestPayload: WalletTransactionRequest): Promise<Agent> {
      const agent: Agent = await this.agentRepository.findOne({ where: { mobileNumber: requestPayload.agentMobileNumber }});
      const walletExists : boolean = await this.walletRepository.exists({ where: { agent: agent }});
      if(!walletExists){
        ApiException.throwNewInstance(HttpStatus.NOT_FOUND, `No wallet found for agent with mobile number ${requestPayload.agentMobileNumber}`);
      }
      return agent;
    }

    public async validateAgentAndWalletForWithdrawal(agent: Agent, amount: number): Promise<void> {
       if(agent.status !== AgentStatus.ACTIVE){
          ApiException.throwNewInstance(HttpStatus.UNAUTHORIZED, `Agent wallet is currently in an ${agent.status}`);
       }
       const wallet: AgentWallet = await this.walletRepository.findOne({ where: { agent: agent }});
       if(!wallet){
          ApiException.throwNewInstance(HttpStatus.NOT_FOUND, `No wallet record found for agent`);
       }
       if(wallet.status !== WalletStatus.ACTIVE){
          ApiException.throwNewInstance(HttpStatus.BAD_REQUEST, `Agent wallet is currently in a ${wallet.status}`);
       }
       if(amount > wallet.balance){
          ApiException.throwNewInstance(HttpStatus.PRECONDITION_FAILED, `Insufficient balance`);
       }
    }

    public async validateRequestForInterWalletTransaction(requestPayload: IntraWalletTransactionRequest): Promise<InterWalletValidationDetails> {
        const agent: Agent = await this.agentRepository.findOne({ where: { mobileNumber: requestPayload.agentMobileNumber }});
        const beneficialAgent: Agent = await this.agentRepository.findOne({ where: { mobileNumber: requestPayload.beneficialAgentMobileNumber }});
        if(!beneficialAgent){
          ApiException.throwNewInstance(HttpStatus.NOT_FOUND, `Beneficial agent with mobile number ${requestPayload.beneficialAgentMobileNumber} not found`);
        }
        await this.validateAgentAndWalletForWithdrawal(agent, requestPayload.amount);
        return { sourceAgent: agent, destinationAgent: beneficialAgent };
    }
}

export interface InterWalletValidationDetails{
   sourceAgent: Agent;
   destinationAgent: Agent;
}