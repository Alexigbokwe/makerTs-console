"use strict";
import CustomValidationRuleProgram from "./program";

class RuleCommand {
  static async handle(program: any) {
    await program
      .command("make-rule <rulename>")
      .description("Create custom validation rule")
      .action((rulename: any) => {
        CustomValidationRuleProgram.handle(rulename);
      });
  }
}

export default RuleCommand;
