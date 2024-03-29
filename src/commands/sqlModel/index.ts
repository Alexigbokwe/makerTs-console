"use strict";
import { ORM } from "../../index";
import sqlProgram from "./program";

class SqlCommand {
  static async handle(program: any, orm: ORM) {
    await program
      .command("make-sql-model <modelname>")
      .option("-m", "-migration", "Generate migration with sql model")
      .description("Create a new sql model class")
      .action((modelname: any, resource: { m: any }) => {
        sqlProgram.handle(modelname, resource.m, orm);
      });
  }
}

export default SqlCommand;
