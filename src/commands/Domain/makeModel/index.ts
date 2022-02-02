"use strict";
import makeDomainModelProgram from "./program";

class MakeDomainModelCommand {
  static async handle(program: any) {
    await program
      .command("domain:make-model <modelName> <domainName>")
      .description("Create domain model. First argument is model name, second is domain name")
      .action((modelName: string, domainName: string) => {
        makeDomainModelProgram.handle(modelName, domainName);
      });
  }
}

export default MakeDomainModelCommand;
