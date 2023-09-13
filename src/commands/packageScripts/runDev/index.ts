"use strict";
import DevelopmentServerProgram from "./program";

class AuthCommand {
  static async handle(program: any) {
    await program
      .command("run-dev")
      .description("Run development server")
      .action(() => {
        DevelopmentServerProgram.handle();
      });
  }
}

export default AuthCommand;
