"use strict";
import { argumentChecker } from "../../argumentChecker";
import { Arguments } from "../../Types/CommandTypes";
import { ServiceProgram } from "./program";

class ServiceCommand {
  static async handle(program: any) {
    await program
      .command("make-service <serviceName>")
      .argument("[b]", "Generate Service Broker with Service class")
      .description("Create a new service class with interface")
      .action((consumerName: string, argument?: Arguments.broker) => {
        argumentChecker({ checker: Arguments.broker, argument });
        ServiceProgram.handle(consumerName, argument);
      });
  }
}

export default ServiceCommand;
