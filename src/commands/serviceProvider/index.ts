"use strict";
import providerProgram from"./program";

class providerCommand {
  static async handle(program:any) {
    await program
      .command("make-provider [providerName]")
      .description("Create a new job class")
      .action((providerName:string) => {
        providerProgram.handle(providerName);
      });
  }
}

export default providerCommand;
