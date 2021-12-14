"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const program_1 = __importDefault(require("./program"));
class RPCServerCommand {
    static async handle(program) {
        await program
            .command("rpc-consumer [consumerName]")
            .description("Create a new RPC consumer class")
            .action((consumerName) => {
            program_1.default.handle(consumerName);
        });
    }
}
exports.default = RPCServerCommand;
