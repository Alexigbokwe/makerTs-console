"use strict";
import sqlProgram from"./program";

class SqlCommand {
  static async handle(program:any) {
    await program
      .command("make-sql-model <modelname>")
      .option("-m", "-migration", "Generation migration with sql model")
      .description("Create a new sql model class")
      .action((modelname: any, resource: { m: any; }) => {
        sqlProgram.handle(modelname, resource.m);
      });
  }
}

export default SqlCommand;
