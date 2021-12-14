"use strict";
import rpcServerProgram from "./program";

class RPCServerCommand {
  static async handle(program: any) {
    await program
      .command("rpc-consumer [consumerName]")
      .description("Create a new RPC consumer class")
      .action((consumerName: string) => {
        rpcServerProgram.handle(consumerName);
      });
  }
}

export default RPCServerCommand;
