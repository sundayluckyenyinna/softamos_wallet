/*eslint-disable*/

import { Injectable } from "@nestjs/common";
import { Request, Response } from "express";
import { Logger, NestMiddleware } from "@nestjs/common";

@Injectable()
export default class ApplicationLoggerMiddleware implements NestMiddleware {

  globalLogger: Logger = new Logger(ApplicationLoggerMiddleware.name);

  use(req: Request, res: Response, next: (error?: any) => void): any {
    const [url, method, ip] = [req.url, req.method, req.ip];
    const fullMessage: string = `${url}  ${method.toUpperCase()}  ${ip}`
    this.globalLogger.log(fullMessage);
    next();
  }

}