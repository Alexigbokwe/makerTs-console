"use strict";
import makeSqlMigratiomProgram from "./program";

class MakeSqlMigratiomCommand {
  static async handle(program:any) {
    await program
      .command("make-sql-migration <migrationName>")
      .alias("msqlm")
      .description("Create a new migration file")
      .action((migrationName:string) => {
        makeSqlMigratiomProgram.handle(migrationName);
      });
  }
}

export default MakeSqlMigratiomCommand;
