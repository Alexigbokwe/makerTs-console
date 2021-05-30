"use strict";
import eventProgram from "./program";

class EventCommand {
  static async handle(program: any) {
    await program
      .command("make-identity")
      .description("Create identity manager")
      .action(() => {
        eventProgram.handle();
      });
  }
}

export default EventCommand;
