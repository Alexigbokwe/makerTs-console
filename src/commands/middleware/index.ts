"use strict";
import { MiddlewareProgram } from "./program";

class MiddlewareCommand {
  static async handle(program: any) {
    await program
      .command("make-middleware <middleWareName>")
      .description("Create a new middleware class")
      .action((middleWareName: string) => {
        MiddlewareProgram.handle(middleWareName);
      });
  }
}

export default MiddlewareCommand;
