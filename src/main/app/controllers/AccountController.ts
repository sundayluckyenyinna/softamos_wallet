/*eslint-disable*/

import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags
} from "@nestjs/swagger";
import { Body, Controller, Get, HttpStatus, Post, Req, Res } from "@nestjs/common";
import {
  ApiResponse,
  BadRequestPayload,
  DirectTransferInstructions,
  InternalServerError
} from "../payloads/ResponsePayload";
import AccountService from "../services/AccountService";
import { Request, Response } from "express";
import { MessagePattern, Transport } from "@nestjs/microservices";
import MessagePatternCommand from "../event/MessagePatternCommand";
import { CreateAccountRequest } from "../payloads/RequestPayload";


@ApiTags('Agent account service')
@ApiBadRequestResponse({ description: "Bad request response", status: HttpStatus.BAD_REQUEST, type: BadRequestPayload })
@ApiCreatedResponse({ status: HttpStatus.CREATED })
@ApiInternalServerErrorResponse({ description: "Server error",  type: InternalServerError })
@ApiBearerAuth()
@Controller({ path: '/agents/account'})
export default class AccountController {

  constructor(private readonly accountService: AccountService) {
  }


  @MessagePattern({ cmd: MessagePatternCommand.CREATE_VIRTUAL_ACCOUNT })
  @Post('/inter-bank/transfer-instructions')
  @ApiOperation({ description: "This API is used to process agent withdrawal from agent active wallet"})
  @ApiOkResponse({description: "Successful response", status: HttpStatus.OK, type: ApiResponse<DirectTransferInstructions>})
  async handleInterbankTransfer(@Req() request: Request, @Body() requestBody: CreateAccountRequest): Promise<ApiResponse<DirectTransferInstructions>>{
    const authorization: string = request.headers.authorization || request.header('Authorization');
    return await this.accountService.processVirtualAccountCreation(requestBody);
  }

}