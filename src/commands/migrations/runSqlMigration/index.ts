"use strict";
import { RunSqlMigrationProgram } from "./program";

class RunSqlMigrationCommand {
  static async handle(program: any) {
    await program
      .command("run-sql-migration")
      .alias("rsqlm")
      .description("Run Sql Migrations")
      .action(() => {
        RunSqlMigrationProgram.handle();
      });
  }
}

export default RunSqlMigrationCommand;
