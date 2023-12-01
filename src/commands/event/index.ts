"use strict";
import { EventProgram } from "./program";

class EventCommand {
  static async handle(program: any) {
    await program
      .command("make-event <eventname>")
      .description("Create a new event class")
      .action((eventname: any) => {
        EventProgram.handle(eventname);
      });
  }
}

export default EventCommand;
