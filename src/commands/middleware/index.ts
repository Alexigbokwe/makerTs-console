"use strict";
import middlewareProgram from "./program";

class MiddlewareCommand {
  static async handle(program:any) {
    await program
      .command("make-middleware <middlewarename>")
      .description("Create a new middleware class")
      .action((middlewarename:string) => {
        middlewareProgram.handle(middlewarename);
      });
  }
}

export default MiddlewareCommand;
