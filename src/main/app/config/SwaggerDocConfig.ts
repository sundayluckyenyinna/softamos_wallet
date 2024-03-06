/*eslint-disable*/

import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from "@nestjs/swagger";
import Environment from "./Environment";

export default class SwaggerDocConfig{

    public static initSwaggerDocConfiguration(app: INestApplication){
      const config: Omit<OpenAPIObject, "paths"> = new DocumentBuilder()
        .setTitle("Wallet and account service")
        .setDescription("Wallet and account service")
        .setVersion("1.0.0")
        .addBearerAuth()
        .addTag("")
        .build();
       const document = SwaggerModule.createDocument(app, config);
       SwaggerModule.setup(Environment.getProperty("swagger.doc.basePath"), app, document);
    }
}