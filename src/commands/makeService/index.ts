"use strict";
import { Command as Program } from "commander";
import { CommandArgument, CommandOption } from "../../command";
import { Arguments } from "../../Types/CommandTypes";
import { ServiceProgram } from "./program";

class MakeServiceCommand {
  static async handle(program: Program) {
    // Define arguments and options using the new system
    const commandArguments: CommandArgument[] = [{ name: "serviceName", mode: "REQUIRED", description: "The name of the service class" }];

    const options: CommandOption[] = [{ flag: "-b,--broker", description: "Generate Service Broker with Service class" }];

    // Build command signature dynamically from arguments
    const commandSignature = commandArguments.map((arg) => (arg.mode === "REQUIRED" ? `<${arg.name}>` : `[${arg.name}]`)).join(" ");

    // Build the command with enhanced features
    const cmd = program.command(`make-service ${commandSignature}`).description("Create a new service class");

    // Add options dynamically
    options.forEach((option) => {
      cmd.option(option.flag, option.description);
    });

    // Enhanced action with better argument handling
    cmd.action((serviceName: string, options: any) => {
      // Pass the broker flag as the enum value if provided
      const brokerArg = options.broker ? Arguments.broker : undefined;
      ServiceProgram.handle(serviceName, brokerArg);
    });
  }
}

export default MakeServiceCommand;
