"use strict";
import { Command as Program } from "commander";
import { CommandArgument, CommandOption } from "../../../command";
import { ORM } from "../../../Types/CommandTypes";
import makeDomainModelProgram from "./program";

class MakeDomainModelCommand {
  static async handle(program: Program, orm: ORM) {
    // Define arguments and options using the new system
    const commandArguments: CommandArgument[] = [
      { name: "modelName", mode: "REQUIRED", description: "The name of the model" },
      { name: "domainName", mode: "REQUIRED", description: "The name of the domain" },
    ];

    const options: CommandOption[] = [];

    // Build command signature dynamically from arguments
    const commandSignature = commandArguments.map((arg) => (arg.mode === "REQUIRED" ? `<${arg.name}>` : `[${arg.name}]`)).join(" ");

    // Build the command with enhanced features
    const cmd = program.command(`domain:make-model ${commandSignature}`).description("Create domain model. First argument is model name, second is domain name");

    // Add options dynamically
    options.forEach((option) => {
      cmd.option(option.flag, option.description);
    });

    // Enhanced action with better argument handling
    cmd.action((modelName: string, domainName: string) => {
      makeDomainModelProgram.handle(modelName, domainName, orm);
    });
  }
}

export default MakeDomainModelCommand;
