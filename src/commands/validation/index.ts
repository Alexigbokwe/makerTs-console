"use strict";
import validationProgram from "./program";

class ValidationCommand {
  static async handle(program: any) {
    await program
      .command("make-validation <requestname>")
      .description("Create a new validation class")
      .action((requestname: string) => {
        validationProgram.handle(requestname);
      });
  }
}

export default ValidationCommand;
