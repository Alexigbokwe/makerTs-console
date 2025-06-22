"use strict";
import { Command as Program } from "commander";
import { CommandArgument, CommandOption } from "../../../command";
import { SqlRollDownProgram } from "./program";

class SqlRollDownCommand {
  static async handle(program: Program) {
    // Define arguments and options using the new system
    const commandArguments: CommandArgument[] = [{ name: "migrationName", mode: "OPTIONAL", description: "The name of the migration to roll down" }];

    const options: CommandOption[] = [];

    // Build command signature dynamically from arguments
    const commandSignature = commandArguments.map((arg) => (arg.mode === "REQUIRED" ? `<${arg.name}>` : `[${arg.name}]`)).join(" ");

    // Build the command with enhanced features
    const cmd = program.command(`sql:roll-down ${commandSignature}`).description("Roll down the last migration");

    // Add options dynamically
    options.forEach((option) => {
      cmd.option(option.flag, option.description);
    });

    // Enhanced action with better argument handling
    cmd.action((migrationName: string) => {
      SqlRollDownProgram.handle(migrationName);
    });
  }
}

export default SqlRollDownCommand;
