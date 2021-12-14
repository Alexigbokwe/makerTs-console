"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const baseCommand_1 = __importDefault(require("../baseCommand"));
class RPCServerProgram {
    static async handle(name) {
        name = name[0].toUpperCase() + name.slice(1);
        let checkFolder = baseCommand_1.default.checkFolderExists("./App/RPC_Consumer");
        if (checkFolder) {
            let doesFileExist = await baseCommand_1.default.checkFileExists("./App/RPC_Consumer/" + name + ".ts");
            if (doesFileExist == false) {
                await this.nextStep(name);
            }
            else {
                return baseCommand_1.default.error(name + ".ts already exist. Modify RPC consumer name and try again");
            }
        }
    }
    static async nextStep(name) {
        fs_1.default.appendFile("./App/RPC_Consumer/" + name + ".ts", this.generateRPCConsumer(name), function (err) {
            if (err)
                return baseCommand_1.default.error(err.errno);
            baseCommand_1.default.success(name + ".ts class successfully generated in App/RPC_Consumer folder");
            return true;
        });
    }
    static generateRPCConsumer(name) {
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
exports.default = RPCServerProgram;
