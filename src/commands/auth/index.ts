"use strict";
import { ORM } from "../../Types/CommandTypes";
import AuthProgram from "./program";

class AuthCommand {
  static async handle(program: any, orm: ORM) {
    await program
      .command("make-auth")
      .description("Create a new auth class")
      .action(() => {
        AuthProgram.handle(orm);
      });
  }
}

export default AuthCommand;
