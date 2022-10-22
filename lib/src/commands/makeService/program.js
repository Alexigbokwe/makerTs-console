"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const baseCommand_1 = __importDefault(require("../baseCommand"));
const shelljs_1 = __importDefault(require("shelljs"));
class ServiceProgram {
    static async handle(name, broker = null) {
        name = name[0].toUpperCase() + name.slice(1);
        let checkFolder = baseCommand_1.default.checkFolderExists("./App/Service");
        if (checkFolder) {
            let doesServiceExist = await baseCommand_1.default.checkFileExists(`./App/Service/${name}/index.ts`);
            let doesServiceInterfaceExist = await baseCommand_1.default.checkFileExists(`./App/Service/${name}/I${name}/index.ts`);
            let doesServiceBrokerExist = await baseCommand_1.default.checkFileExists(`./App/Service/${name}/${name}Broker/index.ts`);
            if (doesServiceExist == false && doesServiceInterfaceExist == false && doesServiceBrokerExist == false) {
                await this.nextStep(name, broker);
            }
            else {
                return baseCommand_1.default.error(`${name} already exist. Modify Service name and try again`);
            }
        }
        else {
            return baseCommand_1.default.error("Create App/Service directory");
        }
    }
    static async nextStep(name, broker = null) {
        try {
            shelljs_1.default.mkdir("./App/Service/" + name);
            this.loadAbstractService(name);
            this.loadService(name);
            if (broker == "Service Broker") {
                this.loadServiceBroker(name);
            }
        }
        catch (error) {
            return baseCommand_1.default.error(error);
        }
    }
    static loadAbstractService(name) {
        fs_1.default.appendFile(`./App/Service/${name}/I${name}.ts`, this.generateServiceAbstractClass(name), function (err) {
            if (err)
                throw err;
            baseCommand_1.default.success(`I${name}.ts interface successfully generated in App/Service/${name} folder`);
        });
    }
    static loadService(name) {
        fs_1.default.appendFile(`./App/Service/${name}/${name}Imp.ts`, this.generateService(name), function (err) {
            if (err)
                throw err;
            baseCommand_1.default.success(`${name} implementation class successfully generated in App/Service/${name} folder`);
        });
    }
    static loadServiceBroker(name) {
        fs_1.default.appendFile(`./App/Service/${name}/${name}Broker.ts`, this.generateBroker(name), function (err) {
            if (err)
                throw err;
            baseCommand_1.default.success(`${name}Broker.ts class successfully generated in App/Service/${name} folder`);
        });
    }
    static generateServiceAbstractClass(name) {
        const body = `
    export abstract class ${name}Service {
        //
    }`;
        return body;
    }
    static generateService(name, addBase = true) {
        const body = `import {${name}Service} from "./${name}Service";
    ${addBase ? 'import { BaseService } from "../BaseService";' : ""}
    export class ${name}ServiceImp ${addBase ? "extends BaseService" : ""}implements ${name}Service{
        //
    }`;
        return body;
    }
    static generateBroker(name) {
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
exports.default = ServiceProgram;
