/*eslint-disable*/

import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import BadRequestExceptionFilter from "../filters/BadRequestExceptionFilter";
import AppExceptionFilter from "../filters/AppExceptionFilter";

export default class GlobalAppConfig{

   public static initGlobalApplicationConfig(app: INestApplication){
     app.useGlobalPipes(new ValidationPipe());
     app.useGlobalFilters(new BadRequestExceptionFilter(), new AppExceptionFilter());
     app.enableCors({ origin: "*", methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], credentials: true });
   }
}