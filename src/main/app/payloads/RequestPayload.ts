/*eslint-disable*/

import { ApiProperty } from "@nestjs/swagger";
import { IsIn } from "class-validator";
import { Currency } from "../commons/Currency";

export class CreateWalletRequest{

   @ApiProperty({ name: "agentMobileNumber", description: "The registered agent mobile number", required: true })
   agentMobileNumber: string;

   @ApiProperty({ name: "currency", description: "Currency associated with the wallet", required: true })
   @IsIn([Currency.NGN, Currency.USD, Currency.GPB ])
   currency: string;
}

export class CreateAccountRequest{
   @ApiProperty({ name: "agentMobileNumber", description: "The registered agent mobile number", required: true })
   agentMobileNumber: string;

   @ApiProperty({ name: "preferredName", description: "The preferred name of the account", required: true })
   preferredName: string;
}

export class WalletTransactionRequest {

   @ApiProperty({ name: "amount", type: Number, description: "amount", required: true })
   amount: number;

   @ApiProperty({ name: "agentMobileNumber", type: String, description: "agentMobileNumber", required: true})
   agentMobileNumber: string;

   @ApiProperty({ name: "narration", type: String, description: "Narration of the funding"})
   narration: string;

   @ApiProperty({ name: "transactionId", type: String, description: "requestId"})
   requestId: string;
}

export class IntraWalletTransactionRequest{

   @ApiProperty({ name: "amount", type: Number, description: "amount", required: true })
   amount: number;

   @ApiProperty({ name: "agentMobileNumber", type: String, description: "agentMobileNumber", required: true})
   agentMobileNumber: string;

   @ApiProperty({ name: "narration", type: String, description: "Narration of the funding"})
   narration: string;

   @ApiProperty({ name: "transactionId", type: String, description: "requestId"})
   requestId: string;

   @ApiProperty({ name: "beneficialAgentMobile", type: String, description: "Beneficial agent mobile number" })
   beneficialAgentMobileNumber: string;
}
