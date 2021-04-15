"use strict";
import scheduledProgram from "./program";

class ListenerCommand {
  static async handle(program:any) {
    await program
      .command("run-schedule")
      .description("Run the scheduled commands")
      .action(() => {
        scheduledProgram.handle();
      });
  }
}

export default ListenerCommand;
