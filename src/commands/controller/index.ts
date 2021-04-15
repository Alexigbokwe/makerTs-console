import controllerProgram from "./program";

class ControllerCommand {
  static async handle(program:any) {
    await program
      .command("make-controller <controllername>")
      .option("-r", "-resource", "Controller Resource Methods")
      .description("Create a new controller class")
      .action((controllername: any, resource: { r: null | undefined; }) => {
        controllerProgram.handle(controllername, resource.r);
      });
  }
}

export default ControllerCommand;
