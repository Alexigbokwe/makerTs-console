"use strict";
import { Command, CommandArgument, CommandOption } from "../../../command";
import DevelopmentServerProgram from "./program";
import { Command as Program } from "commander";

export class RunDevCommand extends Command {
  public signature = "run-dev";
  public description = "Run development server";

  public arguments: CommandArgument[] = [];

  public options: CommandOption[] = [];

  public fire(): void {
    DevelopmentServerProgram.handle();
  }
}

// Keep the old handle method for backward compatibility
class AuthCommand {
  static async handle(program: Program) {
    await program
      .command("run-dev")
      .description("Run development server")
      .action(() => {
        DevelopmentServerProgram.handle();
      });
  }
}

export default AuthCommand;
