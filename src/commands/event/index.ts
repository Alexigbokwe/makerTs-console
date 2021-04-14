"use strict";
import eventProgram from "./program";

class EventCommand {
  static async handle(program:any) {
    await program
      .command("make-event <eventname>")
      .description("Create a new event class")
      .action((eventname: any) => {
        eventProgram.handle(eventname);
      });
  }
}

export default EventCommand;
