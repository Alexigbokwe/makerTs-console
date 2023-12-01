"use strict";
import { MakeSqlMigrationProgram } from "./program";

class MakeSqlMigrationCommand {
  static async handle(program: any) {
    await program
      .command("make-sql-migration <migrationName>")
      .alias("msqlm")
      .description("Create a new migration file")
      .action((migrationName: string) => {
        MakeSqlMigrationProgram.handle(migrationName);
      });
  }
}

export default MakeSqlMigrationCommand;
