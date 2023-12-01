"use strict";
import { ListenerProgram } from "./program";

class ListenerCommand {
  static async handle(program: { command: (arg0: string) => { (): any; new (): any; description: { (arg0: string): { (): any; new (): any; action: { (arg0: (listenername: any) => void): any; new (): any } }; new (): any } } }) {
    await program
      .command("make-listener <listenerName>")
      .description("Create a new listener class")
      .action((listenerName: string) => {
        ListenerProgram.handle(listenerName);
      });
  }
}

export default ListenerCommand;
