"use strict";
import { Command as Program } from "commander";
import { CommandArgument, CommandOption } from "../../command";
import { JobProgram } from "./program";

class JobCommand {
  static async handle(program: Program) {
    // Define arguments and options using the new system
    const commandArguments: CommandArgument[] = [{ name: "jobName", mode: "OPTIONAL", description: "The name of the job class" }];

    const options: CommandOption[] = [];

    // Build command signature dynamically from arguments
    const commandSignature = commandArguments.map((arg) => (arg.mode === "REQUIRED" ? `<${arg.name}>` : `[${arg.name}]`)).join(" ");

    // Build the command with enhanced features
    const cmd = program.command(`make-job ${commandSignature}`).description("Create a new job class");

    // Add options dynamically
    options.forEach((option) => {
      cmd.option(option.flag, option.description);
    });

    // Enhanced action with better argument handling
    cmd.action((jobName: string) => {
      JobProgram.handle(jobName);
    });
  }
}

export default JobCommand;
