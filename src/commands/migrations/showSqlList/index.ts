"use strict";
import showSqlListProgram from "./program";

class ShowSqlListCommand {
  static async handle(program:any) {
    await program
      .command("show-sql-list")
      .description("Show list of both completed and pending migrations")
      .action(() => {
        showSqlListProgram.handle();
      });
  }
}

export default ShowSqlListCommand;
