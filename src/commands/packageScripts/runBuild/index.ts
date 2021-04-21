"use strict";
import CompileProgram from "./program";

class AuthCommand {
  static async handle(program:any) {
    await program
      .command("run-build")
      .description("Compile project to JavaScript")
      .action(() => {
        CompileProgram.handle();
      });
  }
}

export default AuthCommand;
