"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const program_1 = __importDefault(require("./program"));
class MakeDomainCommand {
    static async handle(program, orm) {
        await program
            .command("make-domain <domainName>")
            .description("Create a new domain")
            .action((domainName) => {
            program_1.default.handle(domainName, orm);
        });
    }
}
exports.default = MakeDomainCommand;
