"use strict";
import { ScheduledProgram } from "./program";

class ListenerCommand {
  static async handle(program: any) {
    await program
      .command("run-schedule")
      .description("Run the scheduled commands")
      .action(() => {
        ScheduledProgram.handle();
      });
  }
}

export default ListenerCommand;
