import { Command as Program } from "commander";
import { CommandArgument, CommandOption } from "../../command";
import controllerProgram from "./program";
import { Arguments } from "../../Types/CommandTypes";

class ControllerCommand {
  static async handle(program: Program) {
    // Define arguments and options using the new system
    const commandArguments: CommandArgument[] = [{ name: "controllerName", mode: "REQUIRED", description: "The name of the controller" }];

    const options: CommandOption[] = [{ flag: "-r, --resource", description: "Generate Controller Resource Methods" }];

    // Build command signature dynamically from arguments
    const commandSignature = commandArguments.map((arg) => (arg.mode === "REQUIRED" ? `<${arg.name}>` : `[${arg.name}]`)).join(" ");

    // Build the command with enhanced features
    const cmd = program.command(`make-controller ${commandSignature}`).description("Create a new controller class");

    // Add options dynamically
    options.forEach((option) => {
      cmd.option(option.flag, option.description);
    });

    // Enhanced action with better argument handling
    cmd.action((controllerName: string, options: any) => {
      controllerProgram.handle(controllerName, "App/Http/Controller", options.resource ? Arguments.resourceController : undefined);
    });
  }
}

export default ControllerCommand;
