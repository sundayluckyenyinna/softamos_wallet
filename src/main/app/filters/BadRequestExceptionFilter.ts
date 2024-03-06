/* eslint-disable */

import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter } from "@nestjs/common";
import { Response } from "express";
import { HttpArgumentsHost } from "@nestjs/common/interfaces";

@Catch(BadRequestException)
export default class BadRequestExceptionFilter implements ExceptionFilter {
    catch(exception: BadRequestException, host: ArgumentsHost): any {
      const context: HttpArgumentsHost = host.switchToHttp();
      context.getResponse<Response>();
      const status: number = exception.getStatus();
      let errorMessage: string = "Bad request";
      const message = exception.getResponse()['message'];
      if(typeof message === 'string')
        errorMessage = message;
      else if (typeof message === 'object')
        errorMessage = message.join(', ');
      const errorResponse = {
         code: status,
         message: errorMessage
      }
      return errorResponse;
    }

}