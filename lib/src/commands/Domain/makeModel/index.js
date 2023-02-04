"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const program_1 = __importDefault(require("./program"));
class MakeDomainModelCommand {
    static async handle(program, orm) {
        await program
            .command("domain:make-model <modelName> <domainName>")
            .description("Create domain model. First argument is model name, second is domain name")
            .action((modelName, domainName) => {
            program_1.default.handle(modelName, domainName, orm);
        });
    }
}
exports.default = MakeDomainModelCommand;
