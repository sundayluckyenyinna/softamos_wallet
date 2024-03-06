/*eslint-disable*/

import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import WalletModule from "./main/app/WalletModule";
import DatasourceConfig from "./main/app/config/DatasourceConfig";
import ApplicationLoggerMiddleware from "./main/app/middlewares/ApplicationLoggerMiddleware";
import AuthenticationMiddleware from "./main/app/middlewares/AuthenticationMiddleware";

@Module({
  imports: [DatasourceConfig.InitSQLDatasourceConfiguration(), WalletModule],
  providers: [ApplicationLoggerMiddleware, AuthenticationMiddleware]
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer): any {
  //   consumer
  //     .apply(ApplicationLoggerMiddleware, AuthenticationMiddleware)
  //     .forRoutes({path: "/**", method: RequestMethod.ALL});
  // }
}
