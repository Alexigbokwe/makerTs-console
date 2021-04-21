"use strict";
import RunStartProgram from "./program";

class AuthCommand {
  static async handle(program:any) {
    await program
      .command("run-start")
      .description("Run production server")
      .action(() => {
        RunStartProgram.handle();
      });
  }
}

export default AuthCommand;
