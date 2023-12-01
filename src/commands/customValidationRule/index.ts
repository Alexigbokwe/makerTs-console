"use strict";
import { CustomValidationRuleProgram } from "./program";

class RuleCommand {
  static async handle(program: any) {
    await program
      .command("make-rule <ruleName>")
      .description("Create custom validation rule")
      .action((ruleName: any) => {
        CustomValidationRuleProgram.handle(ruleName);
      });
  }
}

export default RuleCommand;
