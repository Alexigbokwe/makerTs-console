"use strict";
import requestProgram from "./program";

class RequestCommand {
  static async handle(program:any) {
    await program
      .command("make-request <requestname>")
      .description("Create a new request class")
      .action((requestname:string) => {
        requestProgram.handle(requestname);
      });
  }
}

export default RequestCommand;
