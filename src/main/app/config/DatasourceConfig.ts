/* eslint-disable */

import { DynamicModule, Injectable, Logger } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import Environment from "./Environment";

/**
 * This class provides all configuration modules that must be available for the lifespan of the application.
 */
@Injectable()
export default class DatasourceConfig {

  static logger: Logger = new Logger(DatasourceConfig.name);


  static InitSQLDatasourceConfiguration() : DynamicModule {

    const host: string = Environment.getProperty("app.datasource.host");
    const port: string = Environment.getProperty("app.datasource.port")
    const username: string = Environment.getProperty("app.datasource.username");
    const password: string = Environment.getProperty("app.datasource.password");
    const databaseName: string = Environment.getProperty("app.datasource.database");

    // Log the initialization step to the logger.
    this.logger.log("Initializing datasource configurations");

    const datasourceRootModule: DynamicModule = TypeOrmModule.forRoot({
      type: 'mysql',
      host: host,
      port: Number(port),
      username: username,
      password: password,
      database: databaseName,
      autoLoadEntities: true,
      synchronize: true
    });


    this.logger.log("Datasource properties picked in configuration file");
    this.logger.log("Datasource host: ".concat(host));
    this.logger.log("Datasource port: ".concat(port));
    this.logger.log("Datasource username: ".concat(username));
    this.logger.log("Datasource database name: ".concat(databaseName));

    return datasourceRootModule;
  }


}