import { Command } from "commander";
import controllerProgram from "./program";
import { Arguments } from "../../Types/CommandTypes";
import { argumentChecker } from "../../argumentChecker";

class ControllerCommand {
  static async handle(program: Command) {
    program
      .command("make-controller <controllerName>")
      .argument("[r]", "Generate Controller Resource Methods")
      .description("Create a new controller class")
      .action((controllerName: any, argument?: Arguments.resourceController) => {
        argumentChecker({ checker: Arguments.resourceController, argument });
        controllerProgram.handle(controllerName, "App/Http/Controller", argument);
      });
  }
}

export default ControllerCommand;
