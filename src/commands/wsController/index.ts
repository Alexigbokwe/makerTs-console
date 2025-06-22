"use strict";
import { Command as Program } from "commander";
import { CommandArgument, CommandOption } from "../../command";
import { WsControllerProgram } from "./program";

class WsControllerCommand {
  static async handle(program: Program) {
    // Define arguments and options using the new system
    const commandArguments: CommandArgument[] = [{ name: "wsControllerName", mode: "REQUIRED", description: "The name of the WebSocket controller class" }];

    const options: CommandOption[] = [];

    // Build command signature dynamically from arguments
    const commandSignature = commandArguments.map((arg) => (arg.mode === "REQUIRED" ? `<${arg.name}>` : `[${arg.name}]`)).join(" ");

    // Build the command with enhanced features
    const cmd = program.command(`make-ws-controller ${commandSignature}`).description("Create a new WebSocket controller class");

    // Add options dynamically
    options.forEach((option) => {
      cmd.option(option.flag, option.description);
    });

    // Enhanced action with better argument handling
    cmd.action((wsControllerName: string) => {
      WsControllerProgram.handle(wsControllerName);
    });
  }
}

export default WsControllerCommand;
