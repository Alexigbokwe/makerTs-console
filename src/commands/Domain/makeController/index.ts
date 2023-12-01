"use strict";
import { argumentChecker } from "../../../argumentChecker";
import { Arguments } from "../../../Types/CommandTypes";
import makeDomainControllerProgram from "./program";

class MakeDomainControllerCommand {
  static async handle(program: any) {
    await program
      .command("domain:make-controller <controllerName> <domainName>")
      .description("Create domain controller. First argument is controller name, second is domain name")
      .argument("[r]", "Generate Controller Resource Methods")
      .action((controllerName: string, domainName: string, argument?: Arguments.resourceController) => {
        argumentChecker({ checker: Arguments.resourceController, argument });
        makeDomainControllerProgram.handle(controllerName, domainName, argument);
      });
  }
}

export default MakeDomainControllerCommand;
