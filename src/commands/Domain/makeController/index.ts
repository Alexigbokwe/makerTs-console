"use strict";
import { Command as Program } from "commander";
import { CommandArgument, CommandOption } from "../../../command";
import { Arguments } from "../../../Types/CommandTypes";
import makeDomainControllerProgram from "./program";

class MakeDomainControllerCommand {
  static async handle(program: Program) {
    // Define arguments and options using the new system
    const commandArguments: CommandArgument[] = [
      { name: "controllerName", mode: "REQUIRED", description: "The name of the controller" },
      { name: "domainName", mode: "REQUIRED", description: "The name of the domain" },
    ];

    const options: CommandOption[] = [{ flag: "-r,--resource", description: "Generate Controller Resource Methods" }];

    // Build command signature dynamically from arguments
    const commandSignature = commandArguments.map((arg) => (arg.mode === "REQUIRED" ? `<${arg.name}>` : `[${arg.name}]`)).join(" ");

    // Build the command with enhanced features
    const cmd = program.command(`domain:make-controller ${commandSignature}`).description("Create domain controller. First argument is controller name, second is domain name");

    // Add options dynamically
    options.forEach((option) => {
      cmd.option(option.flag, option.description);
    });

    // Enhanced action with better argument handling
    cmd.action((controllerName: string, domainName: string, options: any) => {
      const resourceArg = options.resource ? Arguments.resourceController : undefined;
      makeDomainControllerProgram.handle(controllerName, domainName, resourceArg);
    });
  }
}

export default MakeDomainControllerCommand;
