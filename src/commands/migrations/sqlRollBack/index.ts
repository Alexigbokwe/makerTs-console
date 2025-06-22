"use strict";
import { Command as Program } from "commander";
import { CommandArgument, CommandOption } from "../../../command";
import { SqlRollBackProgram } from "./program";

class SqlRollBackCommand {
  static async handle(program: Program) {
    // Define arguments and options using the new system
    const commandArguments: CommandArgument[] = [];

    const options: CommandOption[] = [{ flag: "--all", description: "Rollback all completed migrations" }];

    // Build command signature dynamically from arguments
    const commandSignature = commandArguments.map((arg) => (arg.mode === "REQUIRED" ? `<${arg.name}>` : `[${arg.name}]`)).join(" ");

    // Build the command with enhanced features
    const cmd = program.command(`sql:rollback ${commandSignature}`).description("Rollback all migrations");

    // Add options dynamically
    options.forEach((option) => {
      cmd.option(option.flag, option.description);
    });

    // Enhanced action with better argument handling
    cmd.action((options: any) => {
      SqlRollBackProgram.handle(options.all ?? false);
    });
  }
}

export default SqlRollBackCommand;
