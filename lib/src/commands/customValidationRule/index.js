"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const program_1 = require("./program");
class RuleCommand {
    static async handle(program) {
        await program
            .command("make-rule <ruleName>")
            .description("Create custom validation rule")
            .action((ruleName) => {
            program_1.CustomValidationRuleProgram.handle(ruleName);
        });
    }
}
exports.default = RuleCommand;
