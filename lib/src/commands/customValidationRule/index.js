"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const program_1 = __importDefault(require("./program"));
class RuleCommand {
    static async handle(program) {
        await program
            .command("make-rule <rulename>")
            .description("Create custom validation rule")
            .action((rulename) => {
            program_1.default.handle(rulename);
        });
    }
}
exports.default = RuleCommand;
