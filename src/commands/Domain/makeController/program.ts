import BaseCommand from "../../baseCommand";
import controller from "../../controller/program";
import { Arguments } from "../../../Types/CommandTypes";
import path from "path";

class MakeDomainControllerProgram {
  static async handle(controllerName: string, domainName: string, resource?: Arguments.resourceController) {
    const spinner = BaseCommand.progress();
    domainName = domainName[0].toUpperCase() + domainName.slice(1);
    controllerName = controllerName[0].toUpperCase() + controllerName.slice(1);

    spinner.start(`Generating ${controllerName}Controller in ${domainName} Domain`);

    const domainPath = path.join("Domains", domainName);

    try {
      if (!(await BaseCommand.checkFolderExists(domainPath))) {
        throw new Error(`${domainName} domain does not exist, kindly create it using 'ts-node maker make-domain ${domainName}'`);
      }

      await this.nextStep(controllerName, domainName, resource);
      spinner.succeed(`${controllerName}Controller successfully generated in Domain/${domainName}/Http/Controller directory.`);
    } catch (error) {
      spinner.fail((error as Error).message);
    }
  }

  private static async nextStep(controllerName: string, domainName: string, resource?: Arguments.resourceController) {
    const controllerPath = path.join("Domains", domainName, "Http", "Controller");
    await controller.handle(`${controllerName}Controller`, controllerPath, resource);
  }
}

export default MakeDomainControllerProgram;
