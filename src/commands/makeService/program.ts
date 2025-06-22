"use strict";
import { promises as fs } from "fs";
import BaseCommand from "../baseCommand";
import path from "path";
import { Arguments } from "../../Types/CommandTypes";

export class ServiceProgram {
  static async handle(name: string, broker?: Arguments.broker) {
    const spinner = BaseCommand.progress();
    spinner.start(`Generating service ${name}`);
    name = name[0].toUpperCase() + name.slice(1);
    const servicePath = path.join("App", "Service", name);

    try {
      if (await BaseCommand.checkFileExists(servicePath)) {
        throw new Error(`${name} service already exists. Modify the service name and try again.`);
      }

      await this.nextStep(name, servicePath, broker);
      spinner.succeed(`Service ${name} created successfully.`);
    } catch (error) {
      spinner.fail((error as Error).message);
    }
  }

  private static async nextStep(name: string, servicePath: string, broker?: Arguments.broker) {
    await fs.mkdir(servicePath, { recursive: true });
    await this.loadAbstractService(name, servicePath);
    await this.loadService(name, servicePath);
    if (broker === Arguments.broker) {
      await this.loadServiceBroker(name, servicePath);
    }
  }

  private static async loadAbstractService(name: string, servicePath: string) {
    const interfaceName = `I${name}`;
    const filePath = path.join(servicePath, `${interfaceName}.ts`);
    const body = this.generateServiceAbstractClass(name);
    await fs.writeFile(filePath, body);
    BaseCommand.success(`${interfaceName}.ts interface successfully generated in ${servicePath}`);
  }

  private static async loadService(name: string, servicePath: string) {
    const implementationName = `${name}Imp`;
    const filePath = path.join(servicePath, `${implementationName}.ts`);
    const body = this.generateService(name);
    await fs.writeFile(filePath, body);
    BaseCommand.success(`${implementationName}.ts class successfully generated in ${servicePath}`);
  }

  private static async loadServiceBroker(name: string, servicePath: string) {
    const brokerName = `${name}Broker`;
    const filePath = path.join(servicePath, `${brokerName}.ts`);
    const body = this.generateBroker(name);
    await fs.writeFile(filePath, body);
    BaseCommand.success(`${brokerName}.ts class successfully generated in ${servicePath}`);
  }

  static generateServiceAbstractClass(name: string) {
    const body = `
    export abstract class ${name}Service {
        //
    }`;
    return body;
  }

  static generateService(name: string, addBase = true) {
    const body = `import {${name}Service} from "./${name}Service";
    ${addBase ? 'import { BaseService } from "../BaseService";' : ""}
    export class ${name}ServiceImp ${addBase ? "extends BaseService" : ""}implements ${name}Service{
        //
    }`;
    return body;
  }

  private static generateBroker(name: string) {
    let body = `
    import I${name} from "./I${name}";
    import { IBrokerAction } from "Elucidate/Broker";

    export class ${name} {
      public name: string;
      public version?: number | string;

      constructor() {
        this.name = "${name}";
      }

      public actions: IBrokerAction = {
        //
      };
    }`;
    return body;
  }
}
