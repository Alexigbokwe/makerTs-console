"use strict";
import listenerProgram from "./program";

class ListenerCommand {
  static async handle(program: { command: (arg0: string) => { (): any; new(): any; description: { (arg0: string): { (): any; new(): any; action: { (arg0: (listenername: any) => void): any; new(): any; }; }; new(): any; }; }; }) {
    await program
      .command("make-listener <listenername>")
      .description("Create a new listener class")
      .action((listenername: string) => {
        listenerProgram.handle(listenername);
      });
  }
}

export default ListenerCommand;
