/*eslint-disable*/

import AgentRepository from "../repositories/AgentRepository";
import AgentVirtualAccountRepository from "../repositories/AgentVirtualAccountRepository";
import { ApiResponse, DirectTransferInstructions, WalletTransactionData } from "../payloads/ResponsePayload";
import Agent from "../models/Agent";
import { HttpStatus, Injectable } from "@nestjs/common";
import JwtTokenUtil from "../utils/JwtTokenUtil";
import AgentVirtualAccount from "../models/AgentVirtualAccount";
import AppHelper from "../utils/AppHelper";
import { BankData, MockBankRepository } from "../repositories/MockRepositories";
import { CreateAccountRequest } from "../payloads/RequestPayload";

@Injectable()
export default class AccountService{


   constructor(
     private readonly agentRepository: AgentRepository,
     private readonly virtualAccountRepository: AgentVirtualAccountRepository
   )
   {}

  private static VIRTUAL_ACCOUNT_NAME_PREFIX = "softamos/";

  async processVirtualAccountCreation(requestPayload: CreateAccountRequest): Promise<ApiResponse<DirectTransferInstructions>>{
     const agent: Agent = await this.agentRepository.findOne({where: { mobileNumber: requestPayload.agentMobileNumber }})
    let existingVirtualAccount: AgentVirtualAccount = await this.virtualAccountRepository.findOne({ where: { agent: agent}});
     if(!existingVirtualAccount){
       const bankData: BankData = MockBankRepository.getRandomBank();
        const virtualAccount : AgentVirtualAccount = new AgentVirtualAccount();
        virtualAccount.accountNumber = AppHelper.generateSequence(10);
        virtualAccount.accountName = AccountService.VIRTUAL_ACCOUNT_NAME_PREFIX.concat(requestPayload.preferredName || agent.username);
        virtualAccount.createdAt = new Date();
        virtualAccount.updatedAt = virtualAccount.createdAt;
        virtualAccount.agent = agent;
        virtualAccount.bankName = bankData.bankName;
        virtualAccount.bankCode = bankData.bankCode;
        await this.virtualAccountRepository.save(virtualAccount);
        existingVirtualAccount = virtualAccount;
     }
     const responseData : DirectTransferInstructions = DirectTransferInstructions.fromVirtualAccount(existingVirtualAccount);
    return Promise.resolve(new ApiResponse(HttpStatus.OK, "Successful creation of agent wallet", responseData));
  }

}