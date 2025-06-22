"use strict";
import { Command, CommandArgument, CommandOption } from "../../../command";
import RunStartProgram from "./program";
import { Command as Program } from "commander";

export class RunStartCommand extends Command {
  public signature = "run-start";
  public description = "Run production server";

  public arguments: CommandArgument[] = [];

  public options: CommandOption[] = [];

  public fire(): void {
    RunStartProgram.handle();
  }
}

// Keep the old handle method for backward compatibility
class AuthCommand {
  static async handle(program: Program) {
    await program
      .command("run-start")
      .description("Run production server")
      .action(() => {
        RunStartProgram.handle();
      });
  }
}

export default AuthCommand;
