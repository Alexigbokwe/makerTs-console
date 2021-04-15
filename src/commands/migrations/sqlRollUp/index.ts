"use strict";
import sqlRollUpProgram from "./program";

class SqlRollUpCommand {
  static async handle(program:string) {
    await program
      .command("sql-rollup [migrationName]")
      .alias("sqlru")
      .description(
        "Run the next or specific migration that has not yet been run",
      )
      .action((migrationName:string) => {
        sqlRollUpProgram.handle(migrationName);
      });
  }
}

export default SqlRollUpCommand;
