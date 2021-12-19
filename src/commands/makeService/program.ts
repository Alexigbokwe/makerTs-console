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
      this.loadInterface(name);
      this.loadService(name);
      if (broker == "Service Broker") {
        this.loadServiceBroker(name);
      }
    } catch (error) {
      return BaseCommand.error(error);
    }
  }

  private static loadInterface(name: string) {
    fs.appendFile(`./App/Service/${name}/I${name}.ts`, this.generateServiceInterface(name), function (err) {
      if (err) throw err;
      BaseCommand.success(`I${name}.ts interface successfully generated in App/Service/${name} folder`);
    });
  }

  private static loadService(name: string) {
    fs.appendFile(`./App/Service/${name}/index.ts`, this.generateService(name), function (err) {
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

  private static generateServiceInterface(name: string) {
    let body = `
    interface I${name} {
        //
    }

    export default I${name};`;
    return body;
  }

  private static generateService(name: string) {
    let body = `"use strict";
    import I${name} from "./I${name}";

    class ${name} implements I${name}{
        //
    }

    export default ${name};`;
    return body;
  }

  private static generateBroker(name: string) {
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

export default ServiceProgram;
