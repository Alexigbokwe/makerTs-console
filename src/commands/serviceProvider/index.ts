"use strict";
import { ProviderProgram } from "./program";

class providerCommand {
  static async handle(program: any) {
    await program
      .command("make-provider <providerName>")
      .description("Create new service provider class")
      .action((providerName: string) => {
        ProviderProgram.handle(providerName);
      });
  }
}

export default providerCommand;
