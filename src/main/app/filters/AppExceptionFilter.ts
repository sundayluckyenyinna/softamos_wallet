/* eslint-disable */

import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { Response } from "express";
import { HttpArgumentsHost } from "@nestjs/common/interfaces";
import ApiException from "../exceptions/ApiException";

@Catch(ApiException)
export default class AppExceptionFilter implements ExceptionFilter
{
    catch(exception: ApiException, host: ArgumentsHost): any {
      const context: HttpArgumentsHost = host.switchToHttp();
      context.getResponse<Response>();
      const status: number = exception.code || HttpStatus.INTERNAL_SERVER_ERROR;
      let errorMessage: string = "Api exception";
      const message: any = exception.message || 'Unknown error';
      if(typeof message === 'string')
        errorMessage = message;
      else if (typeof message === 'object')
        errorMessage = message;
      const errorResponse = {
        code: status,
        message: errorMessage
      }
      return errorResponse;
    }

}