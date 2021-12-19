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
            this.loadInterface(name);
            this.loadService(name);
            if (broker == "Service Broker") {
                this.loadServiceBroker(name);
            }
        }
        catch (error) {
            return baseCommand_1.default.error(error);
        }
    }
    static loadInterface(name) {
        fs_1.default.appendFile(`./App/Service/${name}/I${name}.ts`, this.generateServiceInterface(name), function (err) {
            if (err)
                throw err;
            baseCommand_1.default.success(`I${name}.ts interface successfully generated in App/Service/${name} folder`);
        });
    }
    static loadService(name) {
        fs_1.default.appendFile(`./App/Service/${name}/index.ts`, this.generateService(name), function (err) {
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
    static generateServiceInterface(name) {
        let body = `
    interface I${name} {
        //
    }

    export default I${name};`;
        return body;
    }
    static generateService(name) {
        let body = `"use strict";
    import I${name} from "./I${name}";

    class ${name} implements I${name}{
        //
    }

    export default ${name};`;
        return body;
    }
    static generateBroker(name) {
        let body = `
    import I${name} from "./I${name}";
    import broker from "app";

    class ${name}Broker {
      static exposeActions(${name}: I${name}) {
        broker.createService({
          name: "${name}",
          version: "",
          settings: {
            upperCase: true,
          },
          actions: {},
          events: {},
          methods: {},
    
          created() {
            // Fired when the service instance created (with "broker.loadService" or "broker.createService")
          },
    
          merged() {
            // Fired after the service schemas merged and before the service instance created
          },
    
          async started() {
            // Fired when broker starts this service (in "broker.start()")
          },
    
          async stopped() {
            // Fired when broker stops this service (in "broker.stop()")
          },
        });
      }
    }

    export default ${name}Broker;`;
        return body;
    }
}
exports.default = ServiceProgram;
