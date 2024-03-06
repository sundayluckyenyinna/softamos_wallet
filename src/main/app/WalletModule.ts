/*eslint-disable*/

import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import AgentWalletController from "./controllers/AgentWalletController";
import { TypeOrmModule } from "@nestjs/typeorm";
import Agent from "./models/Agent";
import AgentAuth from "./models/AgentAuth";
import AgentWallet from "./models/AgentWallet";
import AgentRepository from "./repositories/AgentRepository";
import AgentAuthRepository from "./repositories/AgentAuthRepository";
import AgentVirtualAccount from "./models/AgentVirtualAccount";
import AgentVirtualAccountRepository from "./repositories/AgentVirtualAccountRepository";
import AgentWalletRepository from "./repositories/AgentWalletRepository";
import AgentWalletTransactionRepository from "./repositories/AgentWalletTransactionRepository";
import AgentWalletTransaction from "./models/AgentWalletTransaction";
import AccountController from "./controllers/AccountController";
import AccountService from "./services/AccountService";
import WalletService from "./services/WalletService";
import WalletValidatorService from "./services/WalletValidatorService";
import ApplicationLoggerMiddleware from "./middlewares/ApplicationLoggerMiddleware";
import AuthenticationMiddleware from "./middlewares/AuthenticationMiddleware";

@Module({
  imports: [ TypeOrmModule.forFeature([Agent, AgentAuth, AgentWallet, AgentVirtualAccount, AgentWalletTransaction])],
  providers: [
    AgentRepository, AgentAuthRepository, AgentVirtualAccountRepository,
    AgentWalletRepository, AgentWalletTransactionRepository, AccountService,
    WalletService, WalletValidatorService, ApplicationLoggerMiddleware, AuthenticationMiddleware
  ],
  controllers: [AgentWalletController, AccountController],
  exports: [AgentRepository]
})
export default class WalletModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(ApplicationLoggerMiddleware, AuthenticationMiddleware)
      .forRoutes({path: "/**", method: RequestMethod.ALL});
  }

}