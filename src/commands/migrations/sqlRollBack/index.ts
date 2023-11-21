"use strict";
import { commandOptionChecker } from "../../../OptionChecker";
import sqlRollBackProgram from "./program";

class SqlRollBackCommand {
  static async handle(program: any) {
    await program
      .command("sql-rollback")
      .option("-all", "-all", "Rollback all completed migrations")
      .alias("sqlrb")
      .description("Rollback the last batch of migrations")
      .action((all: any) => {
        commandOptionChecker(all);
        sqlRollBackProgram.handle(all.r);
      });
  }
}

export default SqlRollBackCommand;
