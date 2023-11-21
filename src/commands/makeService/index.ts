"use strict";
import { commandOptionChecker } from "../../OptionChecker";
import serviceProgram from "./program";

class ServiceCommand {
  static async handle(program: any) {
    await program
      .command("make-service <serviceName>")
      .option("-b", "-broker", "Service Broker")
      .description("Create a new service class with interface")
      .action((consumerName: string, broker: { b: null | undefined }) => {
        commandOptionChecker(broker);
        serviceProgram.handle(consumerName, broker.b);
      });
  }
}

export default ServiceCommand;
