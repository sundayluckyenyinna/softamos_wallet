/*eslint-disable*/

import { Body, Controller, HttpStatus, Post } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags
} from "@nestjs/swagger";
import {
  ApiResponse,
  BadRequestPayload,
  InternalServerError, InterWalletTransferReceipt, WalletTransactionData
} from "../payloads/ResponsePayload";
import {
  CreateWalletRequest,
  IntraWalletTransactionRequest,
  WalletTransactionRequest
} from "../payloads/RequestPayload";
import WalletService from "../services/WalletService";
import { MessagePattern } from "@nestjs/microservices";
import MessagePatternCommand from "../event/MessagePatternCommand";


@ApiTags('Agent wallet account')
@ApiBadRequestResponse({ description: "Bad request response", status: HttpStatus.BAD_REQUEST, type: BadRequestPayload })
@ApiCreatedResponse({ status: HttpStatus.CREATED })
@ApiInternalServerErrorResponse({ description: "Server error",  type: InternalServerError })
@ApiBearerAuth()
@Controller({ path: '/agents/wallet' })
export default class AgentWalletController {


  constructor(
    private readonly walletService: WalletService
  ) {}


  @MessagePattern({ cmd: MessagePatternCommand.CREATE_WALLET })
  @Post('/create')
  @ApiOperation({ description: "This API creates a wallet account for an agent. This is preferably called during agent signup or registration"})
  @ApiOkResponse({description: "Successful response", status: 200, type: ApiResponse<WalletTransactionData>})
  async handleWalletCreation(@Body() requestPayload: CreateWalletRequest): Promise<ApiResponse<WalletTransactionData>>{
    console.log(requestPayload);
     return this.walletService.processWalletCreation(requestPayload);
  }


  @Post('/fund')
  @ApiOperation({ description: "This API is used to fund an agent wallet by a super admin"})
  @ApiOkResponse({description: "Successful response", status: HttpStatus.OK, type: ApiResponse<WalletTransactionData>})
  async handleAgentWalletFunding(@Body() requestPayload: WalletTransactionRequest): Promise<ApiResponse<WalletTransactionData>>{
     return this.walletService.processWalletFunding(requestPayload);
  }

  @MessagePattern({ cmd: MessagePatternCommand.DEBIT_WALLET })
  @Post('/withdraw')
  @ApiOperation({ description: "This API is used to process agent withdrawal from agent active wallet"})
  @ApiOkResponse({description: "Successful response", status: HttpStatus.OK, type: ApiResponse<WalletTransactionData>})
  async handleAgentWalletWithdrawal(@Body() requestPayload: WalletTransactionRequest): Promise<ApiResponse<WalletTransactionData>> {
     return this.walletService.processWalletWithdrawal(requestPayload);
  }

  @Post('/inter-bank/transfer')
  @ApiOperation({ description: "This API is used to process agent withdrawal from agent active wallet"})
  @ApiOkResponse({description: "Successful response", status: HttpStatus.OK, type: ApiResponse<WalletTransactionData>})
  async handleInterbankTransfer(@Body() requestPayload: IntraWalletTransactionRequest): Promise<InterWalletTransferReceipt>{
     return this.walletService.processIntraWalletTransfer(requestPayload);
  }
}