"use strict";
import { SqlRollUpProgram } from "./program";

class SqlRollUpCommand {
  static async handle(program: { command: (arg0: string) => { (): any; new (): any; alias: { (arg0: string): { (): any; new (): any; description: { (arg0: string): { (): any; new (): any; action: { (arg0: (migrationName: string) => void): any; new (): any } }; new (): any } }; new (): any } } }) {
    await program
      .command("sql-rollup [migrationName]")
      .alias("sqlru")
      .description("Run the next or specific migration that has not yet been run")
      .action((migrationName: string) => {
        SqlRollUpProgram.handle(migrationName);
      });
  }
}

export default SqlRollUpCommand;
