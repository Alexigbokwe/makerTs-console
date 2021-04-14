"use strict";
import consoleProgram from "./program"

class ListenerCommand {
  static async handle(program:any) {
    await program
      .command("make-command <commandName>")
      .description("Create a new Maker command")
      .action((commandName:string) => {
        consoleProgram.handle(commandName);
      });
  }
}

export default ListenerCommand;
