"use strict";
import { Command as Program } from "commander";
import { CommandArgument, CommandOption } from "../../../command";
import { SqlRollUpProgram } from "./program";

class SqlRollUpCommand {
  static async handle(program: Program) {
    // Define arguments and options using the new system
    const commandArguments: CommandArgument[] = [{ name: "migrationName", mode: "OPTIONAL", description: "The name of the migration to roll up" }];

    const options: CommandOption[] = [];

    // Build command signature dynamically from arguments
    const commandSignature = commandArguments.map((arg) => (arg.mode === "REQUIRED" ? `<${arg.name}>` : `[${arg.name}]`)).join(" ");

    // Build the command with enhanced features
    const cmd = program.command(`sql-rollup ${commandSignature}`).alias("sqlru").description("Run the next or specific migration that has not yet been run");

    // Add options dynamically
    options.forEach((option) => {
      cmd.option(option.flag, option.description);
    });

    // Enhanced action with better argument handling
    cmd.action((migrationName?: string) => {
      SqlRollUpProgram.handle(migrationName ?? "");
    });
  }
}

export default SqlRollUpCommand;
