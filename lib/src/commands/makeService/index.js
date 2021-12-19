"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const program_1 = __importDefault(require("./program"));
class ServiceCommand {
    static async handle(program) {
        await program
            .command("make-service <serviceName>")
            .option("-b", "-broker", "Service Broker")
            .description("Create a new service class with interface")
            .action((consumerName, broker) => {
            program_1.default.handle(consumerName, broker.b);
        });
    }
}
exports.default = ServiceCommand;
