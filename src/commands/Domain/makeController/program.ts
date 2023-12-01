import Ora from "ora";
import fs from "fs";
import BaseCommand from "../../baseCommand";
import controller from "../../controller/program";
import { Arguments } from "../../../Types/CommandTypes";
const spinner = Ora("Processing: ");

class MakeDomainControllerProgram {
  static async handle(controllerName: string, domainName: string, resource?: Arguments.resourceController) {
    spinner.start();
    spinner.color = "magenta";
    domainName = domainName[0].toUpperCase() + domainName.slice(1);
    controllerName = controllerName[0].toUpperCase() + controllerName.slice(1);

    spinner.text = "Generating " + controllerName + "Controller in " + domainName + " Domain";

    try {
      if (!this.domainExist("./Domains/" + domainName)) {
        throw new Error(domainName + " domain does not exist, kindly create it using 'ts-node maker make-domain " + domainName + "'");
      } else {
        await this.nextStep(controllerName, domainName, resource);
        spinner.color = "green";
        spinner.text = "Completed";
        spinner.succeed(`${controllerName}Controller successfully generated in Domain/${domainName}/Http/Controller directory.`);
      }
    } catch (error) {
      spinner.color = "red";
      spinner.text = "failed";
      spinner.fail("");
      BaseCommand.error(error);
    }
  }

  private static async nextStep(controllerName: string, domainName: string, resource?: Arguments.resourceController) {
    await controller.handle(`${controllerName}Controller`, "Domains/" + domainName + "/Http/Controller", resource);
  }

  private static domainExist(name: string) {
    if (fs.existsSync(name)) {
      return true;
    } else {
      return false;
    }
  }
}

export default MakeDomainControllerProgram;
