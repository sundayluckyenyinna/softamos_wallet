/*eslint-disable*/

import AgentRepository from "../repositories/AgentRepository";
import AgentVirtualAccountRepository from "../repositories/AgentVirtualAccountRepository";
import { ApiResponse, DirectTransferInstructions } from "../payloads/ResponsePayload";
import Agent from "../models/Agent";
import { HttpStatus, Injectable } from "@nestjs/common";
import AgentVirtualAccount from "../models/AgentVirtualAccount";
import AppHelper from "../utils/AppHelper";
import { BankData, MockBankRepository } from "../repositories/MockRepositories";
import { CreateAccountRequest } from "../payloads/RequestPayload";
import JwtTokenUtil from "../utils/JwtTokenUtil";
import ApiException from "../exceptions/ApiException";

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

    async processDirectWalletTransferInstructions(token: string): Promise<ApiResponse<DirectTransferInstructions>>{
      const mobileNumber: string = JwtTokenUtil.getMobileNumberFromToken(token);
      const agent: Agent = await this.agentRepository.findOne({ where: { mobileNumber: mobileNumber }});
      const virtualAccount: AgentVirtualAccount = await this.virtualAccountRepository.findOne({ where: { agent: agent }});
      if(!virtualAccount){
        ApiException.throwNewInstance(HttpStatus.NOT_FOUND, `No virtual account record found for agent!`);
      }
      const responseData: DirectTransferInstructions = DirectTransferInstructions.fromVirtualAccount(virtualAccount);
      return Promise.resolve(new ApiResponse(HttpStatus.OK, "Successful retrieval of agent virtual account", responseData));
    }
}