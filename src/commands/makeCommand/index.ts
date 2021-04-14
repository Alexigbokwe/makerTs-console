"use strict";
import consoleProgram from "./program"

class ListenerCommand {
  static async handle(program) {
    await program
      .command("make-command <commandName>")
      .description("Create a new Maker command")
      .action((commandName) => {
        consoleProgram.handle(commandName);
      });
  }
}

export default ListenerCommand;
