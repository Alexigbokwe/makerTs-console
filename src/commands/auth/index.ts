"use strict";
import AuthProgram from "./program";

class AuthCommand {
  static async handle(program:any) {
    await program
      .command("make-auth")
      .description("Create a new auth class")
      .action(() => {
        AuthProgram.handle();
      });
  }
}

export default AuthCommand;
