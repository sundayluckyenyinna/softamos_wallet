/*eslint-disable*/

import { HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";
import AgentRepository from "../repositories/AgentRepository";
import JwtTokenUtil from "../utils/JwtTokenUtil";
import Agent from "../models/Agent";


@Injectable()
export default class AuthenticationMiddleware implements NestMiddleware{


  private static AUTHORIZATION_PREFIX: string = "Bearer ";

  constructor(private readonly agentRepository: AgentRepository) {
  }

  async use(req: Request, res: Response, next: (error?: any) => void): Promise<any> {
    const authorizationHeader: string = req.headers.authorization || req.header('Authorization');
    if (!authorizationHeader) {
      const errorResponse: object = this.buildErrorResponse(HttpStatus.FORBIDDEN, `You are forbidden to perform this request`);
      return res.json(errorResponse);
    }
    console.log(authorizationHeader);
    console.log(authorizationHeader.startsWith(AuthenticationMiddleware.AUTHORIZATION_PREFIX));
    if (!authorizationHeader.startsWith(AuthenticationMiddleware.AUTHORIZATION_PREFIX)) {
      const errorResponse: object = this.buildErrorResponse(HttpStatus.UNAUTHORIZED, `Malformed bearer token`);
      return res.json(errorResponse);
    }

    const token: string = authorizationHeader.replace(AuthenticationMiddleware.AUTHORIZATION_PREFIX, "").trim();
    let agentMobileNumber: string;
    try {
      agentMobileNumber = JwtTokenUtil.getMobileNumberFromToken(token);
    } catch (error) {
      const response = this.buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, error);
      return res.json(response);
    }

    const agent: Agent = await this.agentRepository.findOne({ where: { mobileNumber: agentMobileNumber }});
    if(!agent){
       const errorResponse: object = this.buildErrorResponse(HttpStatus.NOT_FOUND, `No agent record found matching authorization token!`);
       return res.json(errorResponse);
    }

    // All validation passed. Move to the next middleware or handler in the request chain
    next();
  }

  private buildErrorResponse(code: number, message: string): object{
     return {
      code: code,
      message: message
    }
  }

}