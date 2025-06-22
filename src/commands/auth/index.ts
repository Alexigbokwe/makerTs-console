"use strict";
import { Command as Program } from "commander";
import { CommandArgument, CommandOption } from "../../command";
import { ORM } from "../../Types/CommandTypes";
import AuthProgram from "./program";

class AuthCommand {
  static async handle(program: Program, orm: ORM) {
    // Define arguments and options using the new system
    const commandArguments: CommandArgument[] = [];

    const options: CommandOption[] = [];

    // Build command signature dynamically from arguments
    const commandSignature = commandArguments.map((arg) => (arg.mode === "REQUIRED" ? `<${arg.name}>` : `[${arg.name}]`)).join(" ");

    // Build the command with enhanced features
    const cmd = program.command(`make-auth ${commandSignature}`).description("Create authentication scaffolding");

    // Add options dynamically
    options.forEach((option) => {
      cmd.option(option.flag, option.description);
    });

    // Enhanced action with better argument handling
    cmd.action(() => {
      AuthProgram.handle(orm);
    });
  }
}

export default AuthCommand;
