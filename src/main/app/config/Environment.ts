/* eslint-disable */
import * as yaml from "js-yaml";
import * as fs from "fs";
import * as path from "path";
import { DynamicModule, Injectable, Logger } from "@nestjs/common";
import * as process from "process";
import { ConfigModule } from "@nestjs/config";
import PropertyRegistry from "./PropertyRegistry";


@Injectable()
export default class Environment
{

  private static logger: Logger = new Logger(Environment.name);

  static profile: string;
  static ApplicationProperties = (): DynamicModule => {
    return ConfigModule.forRoot({
      load: [Environment.loadPropertiesOrFail],
      isGlobal: true,
      cache: true
    });
  }

  public static loadPropertiesOrFail(): Record<string, any> {
    const mainResourceYamlFile: string = "application.yml";
    const allResourceFiles: Array<string> = Environment.getAllResources();
    if(!allResourceFiles.includes(mainResourceYamlFile)){
      throw Error('No main resource found: Could not find mandatory application.yaml file!')
    }
    const allYamlFiles: Array<string> = allResourceFiles.filter(file => file.endsWith(".yml"));
    const mainResourceFileDoc: Record<string, any> = Environment.getRecordsFromResourceYamlFile(mainResourceYamlFile);
    const activeProfile: string = mainResourceFileDoc.app.profiles.active || 'default';
    if(activeProfile === 'default'){
      return mainResourceFileDoc;
    }
    const propertyFilePath: string = ['application', '-', activeProfile.trim(), '.yml'].join('');
    if(!allYamlFiles.includes(propertyFilePath)) {
      throw Error('Could not find property file: '.concat(propertyFilePath).concat(' due to profile: ').concat(activeProfile).concat(' set in ').concat(mainResourceYamlFile).concat(' file'));
    }

    PropertyRegistry.setItem(Item.ACTIVE_PROFILE, activeProfile);
    Environment.profile = activeProfile;
    this.logger.log(`Found and loaded property configurations with active profile of: ${activeProfile}`);
    return Environment.getRecordsFromResourceYamlFile(propertyFilePath);
  }


  private static getRecordsFromResourceYamlFile = (fileName: string): Record<string, any> => {
    const appConfigRecords: Record<string, any> = yaml.load(fs.readFileSync(Environment
      .getResource(fileName), 'utf8')) as Record<string, any>;
    PropertyRegistry.setItem(Item.APP_CONFIG, appConfigRecords);
    return appConfigRecords;
  }

  private static getResource = (resourceFile: string) : string => {
    return path.join(Environment.getResourceDir(), resourceFile);
  }
  private static getResourceDir = (): string => {
    return path.join(process.cwd(), 'src', 'main', 'resources');
  }
  private static getAllResources = () : Array<string> => {
    return fs.readdirSync(Environment.getResourceDir(), 'utf8');
  }

  public static getProperty = (property: string): string => {
    let records: Record<string, any> = PropertyRegistry.getItem(Item.APP_CONFIG);
    if(records === null || records === undefined || Object.keys(records).length === 0){
      records = Environment.loadPropertiesOrFail();
    }
    const keys: Array<string> = property.trim().split('.');
    let currentValue: string | undefined = undefined;
    for(let i: number = 0; i < keys.length; i++){
      const currentKey: string = keys[i];
      currentValue = records[currentKey];
      if(typeof currentValue !== 'object' || currentValue === undefined)
        break;
      records = currentValue;
    }
    if(typeof currentValue === 'object')
      return undefined;
    return currentValue;
  }

}

class Item{
   static ACTIVE_PROFILE: string = "ACTIVE_PROFILE";
   static APP_CONFIG: string = "APP_CONFIG";
}