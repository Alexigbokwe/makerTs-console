"use strict";
import { Command } from "commander";
import { Arguments, ORM } from "../../Types/CommandTypes";
import { SqlProgram } from "./program";
import { argumentChecker } from "../../argumentChecker";

class SqlCommand {
  static async handle(program: Command, orm: ORM) {
    await program
      .command("make-sql-model <modelName>")
      .argument("[m]", "Generate migration with sql model")
      .description("Create a new sql model class")
      .action((modelName: any, argument?: Arguments.migration) => {
        argumentChecker({ checker: Arguments.migration, argument });
        SqlProgram.handle(modelName, orm, argument);
      });
  }
}

export default SqlCommand;
