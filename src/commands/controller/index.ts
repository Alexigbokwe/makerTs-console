import { Command } from "commander";
import controllerProgram from "./program";

class ControllerCommand {
  static async handle(program: Command) {
    program
      .command("make-controller <controllerName>")
      .option("-r", "-resource", "Controller Resource Methods")
      .description("Create a new controller class")
      .action((controllerName: any, resource: { r: null | undefined }) => {
        controllerProgram.handle(controllerName, resource.r);
      });
  }
}

export default ControllerCommand;
