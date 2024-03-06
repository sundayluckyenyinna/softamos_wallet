/*eslint-disable*/

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { INestApplication, Logger } from "@nestjs/common";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import SwaggerDocConfig from "./main/app/config/SwaggerDocConfig";
import Environment from "./main/app/config/Environment";
import GlobalAppConfig from "./main/app/config/GlobalAppConfig";


async function bootstrap(): Promise<void> {
    const PORT: number = Number(Environment.getProperty("server.port")) || 2000;
    const TCP_PORT: number = Number(Environment.getProperty("microservice.config.port"));
    const logger: Logger = new Logger("AgentAuthorizationApplication");

    Environment.loadPropertiesOrFail();
    const app: INestApplication = await NestFactory.create(AppModule);
    SwaggerDocConfig.initSwaggerDocConfiguration(app);
    GlobalAppConfig.initGlobalApplicationConfig(app);
    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.TCP,
      options: { port: TCP_PORT }
    }, { inheritAppConfig: true });
    await app.startAllMicroservices();
    await app.listen(PORT, () => {
      logger.log(`AgentAuthorizationApplication started on port ${PORT}`);
    });
}

bootstrap();
