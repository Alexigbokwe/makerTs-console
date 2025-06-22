"use strict";
import { Command as Program } from "commander";
import { CommandArgument, CommandOption } from "../../command";
import { RouteProgram } from "./program";

class RouteCommand {
  static async handle(program: Program) {
    // Define arguments and options using the new system
    const commandArguments: CommandArgument[] = [{ name: "routeName", mode: "REQUIRED", description: "The name of the route folder" }];

    const options: CommandOption[] = [];

    // Build command signature dynamically from arguments
    const commandSignature = commandArguments.map((arg) => (arg.mode === "REQUIRED" ? `<${arg.name}>` : `[${arg.name}]`)).join(" ");

    // Build the command with enhanced features
    const cmd = program.command(`make-route ${commandSignature}`).description("Create a new route folder");

    // Add options dynamically
    options.forEach((option) => {
      cmd.option(option.flag, option.description);
    });

    // Enhanced action with better argument handling
    cmd.action((routeName: string) => {
      RouteProgram.handle(routeName);
    });
  }
}

export default RouteCommand;
