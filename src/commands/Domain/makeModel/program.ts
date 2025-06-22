import BaseCommand from "../../baseCommand";
import { SqlProgram } from "../../sqlModel/program";
import { NoSqlProgram } from "../../nosqlModel/program";
import { ORM } from "../../../Types/CommandTypes";
import path from "path";
import { promises as fs } from "fs";

class MakeDomainModelProgram {
  static async handle(modelName: string, domainName: string, orm: ORM): Promise<void> {
    const spinner = BaseCommand.progress();
    domainName = domainName[0].toUpperCase() + domainName.slice(1);
    modelName = modelName[0].toUpperCase() + modelName.slice(1);

    spinner.start(`Generating ${modelName}Model in ${domainName} Domain`);

    const domainPath = path.join("Domains", domainName);

    try {
      if (!(await BaseCommand.checkFolderExists(domainPath))) {
        throw new Error(`${domainName} domain does not exist, kindly create it using 'ts-node maker make-domain ${domainName}'`);
      }

      await this.nextStep(modelName, domainName, orm);
      spinner.succeed(`${modelName}Model successfully generated in Domain/${domainName}/Model directory.`);
    } catch (error) {
      spinner.fail((error as Error).message);
    }
  }

  private static async nextStep(modelName: string, domainName: string, orm: ORM): Promise<void> {
    const modelPath = path.join("Domains", domainName, "Model");
    const filePath = path.join(modelPath, `${modelName}Model.ts`);
    const body = this.modelBody(modelName, orm);
    await fs.writeFile(filePath, body);
  }

  private static modelBody(name: string, orm: ORM): string {
    if (orm !== ORM.Mongoose) {
      return SqlProgram.modelBody(name, orm);
    } else {
      return NoSqlProgram.generateModel(name);
    }
  }
}

export default MakeDomainModelProgram;
