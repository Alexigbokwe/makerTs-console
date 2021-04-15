"use strict";
import sqlRollDownProgram from "./program";

class SqlRollDownCommand {
  static async handle(program:any) {
    await program
      .command("sql-rolldown [migrationName]")
      .alias("sqlrd")
      .description("Undo the last or specific migration that was run")
      .action((migrationName:string) => {
        sqlRollDownProgram.handle(migrationName);
      });
  }
}

export default SqlRollDownCommand;
