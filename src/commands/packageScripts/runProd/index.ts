"use strict";
import RunProductionProgram from "./program";

class ProductionCommand {
  static async handle(program: any) {
    await program
      .command("run-prod")
      .description("Run in production server")
      .action(() => {
        RunProductionProgram.handle();
      });
  }
}

export default ProductionCommand;
