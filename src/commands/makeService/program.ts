"use strict";
import fs from "fs";
import BaseCommand from "../baseCommand";
import shell from "shelljs";

class ServiceProgram {
  static async handle(name: string, broker = null) {
    name = name[0].toUpperCase() + name.slice(1);
    let checkFolder = BaseCommand.checkFolderExists("./App/Service");
    if (checkFolder) {
      let doesServiceExist = await BaseCommand.checkFileExists(`./App/Service/${name}/index.ts`);
      let doesServiceInterfaceExist = await BaseCommand.checkFileExists(`./App/Service/${name}/I${name}/index.ts`);
      let doesServiceBrokerExist = await BaseCommand.checkFileExists(`./App/Service/${name}/${name}Broker/index.ts`);
      if (doesServiceExist == false && doesServiceInterfaceExist == false && doesServiceBrokerExist == false) {
        await this.nextStep(name, broker);
      } else {
        return BaseCommand.error(`${name} already exist. Modify Service name and try again`);
      }
    } else {
      return BaseCommand.error("Create App/Service directory");
    }
  }

  private static async nextStep(name: string, broker = null) {
    try {
      shell.mkdir("./App/Service/" + name);
      this.loadAbstractService(name);
      this.loadService(name);
      if (broker == "Service Broker") {
        this.loadServiceBroker(name);
      }
    } catch (error) {
      return BaseCommand.error(error);
    }
  }

  private static loadAbstractService(name: string) {
    fs.appendFile(`./App/Service/${name}/I${name}.ts`, this.generateServiceAbstractClass(name), function (err) {
      if (err) throw err;
      BaseCommand.success(`I${name}.ts interface successfully generated in App/Service/${name} folder`);
    });
  }

  private static loadService(name: string) {
    fs.appendFile(`./App/Service/${name}/${name}Imp.ts`, this.generateService(name), function (err) {
      if (err) throw err;
      BaseCommand.success(`${name} implementation class successfully generated in App/Service/${name} folder`);
    });
  }

  private static loadServiceBroker(name: string) {
    fs.appendFile(`./App/Service/${name}/${name}Broker.ts`, this.generateBroker(name), function (err) {
      if (err) throw err;
      BaseCommand.success(`${name}Broker.ts class successfully generated in App/Service/${name} folder`);
    });
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

export default ServiceProgram;
