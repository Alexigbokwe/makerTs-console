"use strict";
import { ORM } from "../../../index";
import makeDomainProgram from "./program";

class MakeDomainCommand {
  static async handle(program: any, orm: ORM) {
    await program
      .command("make-domain <domainName>")
      .description("Create a new domain")
      .action((domainName: string) => {
        makeDomainProgram.handle(domainName, orm);
      });
  }
}

export default MakeDomainCommand;
