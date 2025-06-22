"use strict";
import { Command, CommandArgument, CommandOption } from "../../../command";
import CompileProgram from "./program";
import { Command as Program } from "commander";

export class RunBuildCommand extends Command {
  public signature = "run-build";
  public description = "Compile project to JavaScript";

  public arguments: CommandArgument[] = [];

  public options: CommandOption[] = [];

  public fire(): void {
    CompileProgram.handle();
  }
}

// Keep the old handle method for backward compatibility
class AuthCommand {
  static async handle(program: Program) {
    await program
      .command("run-build")
      .description("Compile project to JavaScript")
      .action(() => {
        CompileProgram.handle();
      });
  }
}

export default AuthCommand;
