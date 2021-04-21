"use strict";
import RunDevelopementProgram from "./program";

class AuthCommand {
  static async handle(program:any) {
    await program
      .command("run-dev")
      .description("Run developement server")
      .action(() => {
        RunDevelopementProgram.handle();
      });
  }
}

export default AuthCommand;
