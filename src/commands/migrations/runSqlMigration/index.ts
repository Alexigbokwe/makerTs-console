"use strict";
import runSqlMigratiomProgram from"./program";

class RunSqlMigratiomCommand {
  static async handle(program:any) {
    await program
      .command("run-sql-migration")
      .alias("rsqlm")
      .description("Run Sql Migrations")
      .action(() => {
        runSqlMigratiomProgram.handle();
      });
  }
}

export default RunSqlMigratiomCommand;
