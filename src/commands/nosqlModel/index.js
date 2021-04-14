"use strict";
import noSqlProgram from "./program";

class NoSqlCommand {
  static async handle(program) {
    await program
      .command("make-nosql-model <modelname>")
      .description("Create a new nosql model class")
      .action((modelname) => {
        noSqlProgram.handle(modelname);
      });
  }
}

export default NoSqlCommand;
