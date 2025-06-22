"use strict";
import { Command as Program } from "commander";
import { CommandArgument, CommandOption } from "../../command";
import { CustomValidationRuleProgram } from "./program";

class CustomValidationRuleCommand {
  static async handle(program: Program) {
    // Define arguments and options using the new system
    const commandArguments: CommandArgument[] = [{ name: "ruleName", mode: "REQUIRED", description: "The name of the custom validation rule" }];

    const options: CommandOption[] = [];

    // Build command signature dynamically from arguments
    const commandSignature = commandArguments.map((arg) => (arg.mode === "REQUIRED" ? `<${arg.name}>` : `[${arg.name}]`)).join(" ");

    // Build the command with enhanced features
    const cmd = program.command(`make-validation-rule ${commandSignature}`).description("Create a new custom validation rule");

    // Add options dynamically
    options.forEach((option) => {
      cmd.option(option.flag, option.description);
    });

    // Enhanced action with better argument handling
    cmd.action((ruleName: string) => {
      CustomValidationRuleProgram.handle(ruleName);
    });
  }
}

export default CustomValidationRuleCommand;
