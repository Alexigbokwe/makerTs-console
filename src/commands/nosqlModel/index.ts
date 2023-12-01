"use strict";
import { NoSqlProgram } from "./program";

class NoSqlCommand {
  static async handle(program: any) {
    await program
      .command("make-nosql-model <modelname>")
      .description("Create a new nosql model class")
      .action((modelname: string) => {
        NoSqlProgram.handle(modelname);
      });
  }
}

export default NoSqlCommand;
