import { Command } from "commander";
import controllerProgram from "./program";
import { commandOptionChecker } from "../../OptionChecker";

class ControllerCommand {
  static async handle(program: Command) {
    program
      .command("make-controller <controllerName>")
      .option("-r", "-resource", "Controller Resource Methods")
      .description("Create a new controller class")
      .action((controllerName: any, resource: { r: null | undefined }) => {
        commandOptionChecker(resource);
        controllerProgram.handle(controllerName, resource.r);
      });
  }
}

export default ControllerCommand;
