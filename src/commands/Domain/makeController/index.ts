"use strict";
import { commandOptionChecker } from "../../../OptionChecker";
import makeDomainControllerProgram from "./program";

class MakeDomainControllerCommand {
  static async handle(program: any) {
    await program
      .command("domain:make-controller <controllerName> <domainName>")
      .description("Create domain controller. First argument is controller name, second is domain name")
      .option("-r", "-resource", "Controller Resource Methods")
      .action((controllerName: string, domainName: string, resource: { r: null | undefined }) => {
        commandOptionChecker(resource);
        makeDomainControllerProgram.handle(controllerName, domainName, resource.r);
      });
  }
}

export default MakeDomainControllerCommand;
