import { WsControllerProgram } from "./program";

class WsControllerCommand {
  static async handle(program: any) {
    await program
      .command("make-ws-controller <wsControllerName>")
      .description("Create a new web socket controller class")
      .action((wsControllerName: string) => {
        WsControllerProgram.handle(wsControllerName);
      });
  }
}

export default WsControllerCommand;
