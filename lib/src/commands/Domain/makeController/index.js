"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const program_1 = __importDefault(require("./program"));
class MakeDomainControllerCommand {
    static async handle(program) {
        await program
            .command("domain:make-controller <controllerName> <domainName>")
            .description("Create domain controller. First argument is controller name, second is domain name")
            .option("-r", "-resource", "Controller Resource Methods")
            .action((controllerName, domainName, resource) => {
            program_1.default.handle(controllerName, domainName, resource.r);
        });
    }
}
exports.default = MakeDomainControllerCommand;
