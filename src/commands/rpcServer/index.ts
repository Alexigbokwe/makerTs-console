"use strict";
import rpcServerProgram from "./program";

class RPCServerCommand {
  static async handle(program: any) {
    await program
      .command("rpc-server [consumerName]")
      .description("Start processing messages on the queue via RPC as a daemon")
      .action((consumerName: string) => {
        rpcServerProgram.handle(consumerName);
      });
  }
}

export default RPCServerCommand;
