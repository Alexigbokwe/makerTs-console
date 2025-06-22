"use strict";
import { Command as Program } from "commander";
import { CommandArgument, CommandOption } from "../../command";
import { NoSqlProgram } from "./program";

class NoSqlModelCommand {
  static async handle(program: Program) {
    // Define arguments and options using the new system
    const commandArguments: CommandArgument[] = [{ name: "modelName", mode: "REQUIRED", description: "The name of the NoSQL model class" }];

    const options: CommandOption[] = [];

    // Build command signature dynamically from arguments
    const commandSignature = commandArguments.map((arg) => (arg.mode === "REQUIRED" ? `<${arg.name}>` : `[${arg.name}]`)).join(" ");

    // Build the command with enhanced features
    const cmd = program.command(`make-nosql-model ${commandSignature}`).description("Create a new NoSQL model class");

    // Add options dynamically
    options.forEach((option) => {
      cmd.option(option.flag, option.description);
    });

    // Enhanced action with better argument handling
    cmd.action((modelName: string) => {
      NoSqlProgram.handle(modelName);
    });
  }
}

export default NoSqlModelCommand;
