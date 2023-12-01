"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const argumentChecker_1 = require("../../argumentChecker");
const CommandTypes_1 = require("../../Types/CommandTypes");
const program_1 = require("./program");
class ServiceCommand {
    static async handle(program) {
        await program
            .command("make-service <serviceName>")
            .argument("[b]", "Generate Service Broker with Service class")
            .description("Create a new service class with interface")
            .action((consumerName, argument) => {
            (0, argumentChecker_1.argumentChecker)({ checker: CommandTypes_1.Arguments.broker, argument });
            program_1.ServiceProgram.handle(consumerName, argument);
        });
    }
}
exports.default = ServiceCommand;
