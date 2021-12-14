"use strict";
import fs from "fs";
import BaseCommand from "../baseCommand";

class RPCServerProgram {
  static async handle(name: string) {
    name = name[0].toUpperCase() + name.slice(1);
    let checkFolder = BaseCommand.checkFolderExists("./App/RPC_Consumer");
    if (checkFolder) {
      let doesFileExist = await BaseCommand.checkFileExists("./App/RPC_Consumer/" + name + ".ts");
      if (doesFileExist == false) {
        await this.nextStep(name);
      } else {
        return BaseCommand.error(name + ".ts already exist. Modify RPC consumer name and try again");
      }
    }
  }

  private static async nextStep(name: string) {
    fs.appendFile("./App/RPC_Consumer/" + name + ".ts", this.generateRPCConsumer(name), function (err) {
      if (err) return BaseCommand.error(err.errno);
      BaseCommand.success(name + ".ts class successfully generated in App/RPC_Consumer folder");
      return true;
    });
  }

  private static generateRPCConsumer(name: string) {
    let body = `"use strict";
    import RPC_Server from "expresswebcorets/lib/Queue/RPC_Server";

    class ${name} {
        async handle() {
            await RPC_Server.consume("myQueue");
            let message = RPC_Server.RPC_Consume_Message;
            
            let rpc_response = await this.processMessage(message);
            RPC_Server.sendToQueue(rpc_response);
        }

        async processMessage(message:string):Promise<string>{
           //
        }
    }

    export default ${name};`;
    return body;
  }
}

export default RPCServerProgram;
