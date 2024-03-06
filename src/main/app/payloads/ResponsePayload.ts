/*eslint-disable*/

import { ApiProperty } from "@nestjs/swagger";
import { HttpStatus } from "@nestjs/common";
import AgentWallet from "../models/AgentWallet";
import { TransactionStatus } from "../commons/TransactionStatus";
import Agent from "../models/Agent";
import AgentVirtualAccount from "../models/AgentVirtualAccount";

export class BaseResponse{

   @ApiProperty({ name: "code", description: "Response code", default: HttpStatus.OK })
   code: number;

   @ApiProperty({ name: "message", description: "Response message"})
   message: string;

  constructor(code: number, message: string) {
    this.code = code;
    this.message = message;
  }

}

export class ApiResponse<T> extends BaseResponse{

  @ApiProperty({ name: "data", description: "Response data" })
   data: T | undefined;

  constructor(code: number, message: string, data: T | undefined) {
    super(code, message);
    this.data = data;
  }

  public static of(code: number, message: string, data: object | undefined){
     return new ApiResponse(code, message, data);
  }

  public static ok(message: string, data: object | undefined){
     return new ApiResponse(HttpStatus.OK, message, data);
  }
}

export class BadRequestPayload{
   @ApiProperty({ name: "code", description: "response code", default: HttpStatus.BAD_REQUEST, type: Number })
   private code: number;

   @ApiProperty({ name: "response message", default: "Email must be a valid email", example: "Email must be a valid email", type: String })
   private message: string;
}


export class InternalServerError{
  @ApiProperty({ name: "code", description: "response code", default: HttpStatus.INTERNAL_SERVER_ERROR, type: Number })
  private code: number;

  @ApiProperty({ name: "response message", default: "Internal server error", example: "Internal server error", type: String })
  private message: string;
}


export class WalletTransactionData {

  @ApiProperty({ name: "walletId", description: "The unique 13 digit id number associated to wallet"})
    walletId: string;

  @ApiProperty({ name: "status", description: "The status of the wallet"})
  status: string;

  @ApiProperty({ name: "agentMobile", description: "The agent" })
  agentMobileNumber: string;

  @ApiProperty({ name: "agentEmail", description: "The agent email address"})
  agentEmail: string;

  @ApiProperty({ name: "agentUid", description: "The unique agent uid"})
  agentUid: string;

  @ApiProperty({ name: "agentName", description: "The agent name"})
  agentName: string

  @ApiProperty({ name: "currency", description: "The currency of the wallet"})
  currency: string;

  @ApiProperty({ name: "createdAt", description: "The date of creation"})
  createdAt: string;

  @ApiProperty({ name: "balance", description: "The balance of the wallet"})
  balance: number;

  @ApiProperty({ name: "transactionStatus", type: String, description: "Status of the wallet transaction"})
  transactionStatus: string;

    public static fromWallet(wallet: AgentWallet, transactionStatus?: TransactionStatus): WalletTransactionData{
       const data : WalletTransactionData = new WalletTransactionData();
       data.walletId = wallet.walletId;
       data.status = wallet.status;
       data.agentMobileNumber = wallet.agent.mobileNumber;
       data.agentEmail = wallet.agent.emailAddress;
       data.agentUid = wallet.agent.agentId;
       data.agentName = wallet.agent.username;
       data.currency = wallet.currency;
       data.createdAt = wallet.createdAt.toISOString();
       data.transactionStatus = transactionStatus;
       data.balance = wallet.balance;
       return data;
    }
}

export class InterWalletTransferReceipt{

  @ApiProperty({ name: "walletId", description: "The unique 13 digit id number associated to wallet"})
  walletId: string;

  @ApiProperty({ name: "status", description: "The status of the wallet"})
  status: string;

  @ApiProperty({ name: "agentMobile", description: "The agent"})
  agentMobileNumber: string;

  @ApiProperty({ name: "agentEmail", description: "The agent email address"})
  agentEmail: string;

  @ApiProperty({ name: "agentUid", description: "The unique agent uid"})
  agentUid: string;

  @ApiProperty({ name: "agentName", description: "The agent name"})
  agentName: string

  @ApiProperty({ name: "currency", description: "The currency of the wallet"})
  currency: string;

  @ApiProperty({ name: "createdAt", description: "The date of creation"})
  createdAt: string;

  @ApiProperty({ name: "balance", description: "The balance of the wallet"})
  balance: number;

  @ApiProperty({ name: "beneficialAgentMobileNumber", type: String, description: "Mobile number of the beneficial number"})
  beneficialAgentMobileNumber: string;

  @ApiProperty({ name: "beneficialAgentUsername", type: String, description: "Username of the beneficial number"})
  beneficialAgentUsername: string;


  public static fromWallet(wallet: AgentWallet, beneficialAgent: Agent): InterWalletTransferReceipt{
    const data : InterWalletTransferReceipt = new InterWalletTransferReceipt();
    data.walletId = wallet.walletId;
    data.status = wallet.status;
    data.agentMobileNumber = wallet.agent.mobileNumber;
    data.agentEmail = wallet.agent.emailAddress;
    data.agentUid = wallet.agent.agentId;
    data.agentName = wallet.agent.username;
    data.currency = wallet.currency;
    data.createdAt = wallet.createdAt.toDateString();
    data.balance = wallet.balance;
    data.beneficialAgentMobileNumber = beneficialAgent.mobileNumber;
    data.beneficialAgentUsername = beneficialAgent.username;
    return data;
  }
}

export class DirectTransferInstructions {

  @ApiProperty({ name: "agentName", description: "The agent name"})
  accountNumber: string

  @ApiProperty({ name: "agentName", description: "The agent name"})
  accountName: string;

  @ApiProperty({ name: "agentName", description: "The agent name"})
  bankName: string;

  @ApiProperty({ name: "agentName", description: "The agent name"})
  bankCode: string;

  public static fromVirtualAccount(account: AgentVirtualAccount): DirectTransferInstructions {
     const instructions: DirectTransferInstructions = new DirectTransferInstructions();
     instructions.accountName = account.accountName;
     instructions.accountNumber = account.accountNumber;
     instructions.bankName = account.bankName;
     instructions.bankCode = account.bankCode;
     return instructions;
  }
}