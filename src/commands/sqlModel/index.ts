"use strict";
import { Command as Program } from "commander";
import { CommandArgument, CommandOption } from "../../command";
import { Arguments, ORM } from "../../Types/CommandTypes";
import { SqlProgram } from "./program";

class SqlModelCommand {
  static async handle(program: Program, orm: ORM) {
    // Define arguments and options using the new system
    const commandArguments: CommandArgument[] = [{ name: "modelName", mode: "REQUIRED", description: "The name of the SQL model class" }];

    const options: CommandOption[] = [{ flag: "-m,--migration", description: "Generate migration with sql model" }];

    // Build command signature dynamically from arguments
    const commandSignature = commandArguments.map((arg) => (arg.mode === "REQUIRED" ? `<${arg.name}>` : `[${arg.name}]`)).join(" ");

    // Build the command with enhanced features
    const cmd = program.command(`make-sql-model ${commandSignature}`).description("Create a new SQL model class");

    // Add options dynamically
    options.forEach((option) => {
      cmd.option(option.flag, option.description);
    });

    // Enhanced action with better argument handling
    cmd.action((modelName: string, options: any) => {
      const migrationArg = options.migration ? Arguments.migration : undefined;
      SqlProgram.handle(modelName, orm, migrationArg);
    });
  }
}

export default SqlModelCommand;
