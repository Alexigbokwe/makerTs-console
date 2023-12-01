"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const argumentChecker_1 = require("../../../argumentChecker");
const CommandTypes_1 = require("../../../Types/CommandTypes");
const program_1 = __importDefault(require("./program"));
class MakeDomainControllerCommand {
    static async handle(program) {
        await program
            .command("domain:make-controller <controllerName> <domainName>")
            .description("Create domain controller. First argument is controller name, second is domain name")
            .argument("[r]", "Generate Controller Resource Methods")
            .action((controllerName, domainName, argument) => {
            (0, argumentChecker_1.argumentChecker)({ checker: CommandTypes_1.Arguments.resourceController, argument });
            program_1.default.handle(controllerName, domainName, argument);
        });
    }
}
exports.default = MakeDomainControllerCommand;
