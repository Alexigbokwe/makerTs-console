"use strict";
import sqlRollBackProgram from "./program";

class SqlRollBackCommand {
  static async handle(program:any) {
    await program
      .command("sql-rollback")
      .option("-all", "-all", "Rollback all completed migrations")
      .alias("sqlrb")
      .description("Rollback the last batch of migrations")
      .action((all:any) => {
        sqlRollBackProgram.handle(all.r);
      });
  }
}

export default SqlRollBackCommand;
