"use strict";
import makeDomainProgram from "./program";

class MakeDomainCommand {
  static async handle(program: any) {
    await program
      .command("make-domain <domainName>")
      .description("Create a new domain")
      .action((domainName: string) => {
        makeDomainProgram.handle(domainName);
      });
  }
}

export default MakeDomainCommand;
