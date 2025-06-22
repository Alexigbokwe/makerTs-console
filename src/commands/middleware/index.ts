"use strict";
import { Command as Program } from "commander";
import { CommandArgument, CommandOption } from "../../command";
import { MiddlewareProgram } from "./program";

class MiddlewareCommand {
  static async handle(program: Program) {
    // Define arguments and options using the new system
    const commandArguments: CommandArgument[] = [{ name: "middlewareName", mode: "REQUIRED", description: "The name of the middleware" }];

    const options: CommandOption[] = [];

    // Build command signature dynamically from arguments
    const commandSignature = commandArguments.map((arg) => (arg.mode === "REQUIRED" ? `<${arg.name}>` : `[${arg.name}]`)).join(" ");

    // Build the command with enhanced features
    const cmd = program.command(`make-middleware ${commandSignature}`).description("Create a new middleware");

    // Add options dynamically
    options.forEach((option) => {
      cmd.option(option.flag, option.description);
    });

    // Enhanced action with better argument handling
    cmd.action((middlewareName: string) => {
      MiddlewareProgram.handle(middlewareName);
    });
  }
}

export default MiddlewareCommand;
