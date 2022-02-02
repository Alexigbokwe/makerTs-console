"use strict";
import Ora from "ora";
import fs from "fs";
import BaseCommand from "../../baseCommand";
const spinner = Ora("Processing: ");
import sqlmodel from "../../sqlModel/program";
import noSqlmodel from "../../nosqlModel/program";

class MakeDomainModelProgram {
  static async handle(modelName: string, domainName: string) {
    spinner.start();
    spinner.color = "magenta";
    domainName = domainName[0].toUpperCase() + domainName.slice(1);
    modelName = modelName[0].toUpperCase() + modelName.slice(1);

    spinner.text = "Generating " + modelName + "Model in " + domainName + " Domain";

    try {
      if (!this.domainExist("./Domains/" + domainName)) {
        throw new Error(domainName + " domain does not exist, kindly create it using 'ts-node maker make-domain " + domainName + "'");
      } else {
        await this.nextStep(modelName, domainName);
        spinner.color = "green";
        spinner.text = "Completed";
        spinner.succeed(`${modelName} model successfull generated in Domain/${domainName}/Model directory.`);
      }
    } catch (error) {
      spinner.color = "red";
      spinner.text = "failed";
      spinner.fail("");
      BaseCommand.error(error);
    }
  }

  private static async nextStep(modelName: string, domainName: string) {
    let blockPath = `./Domains/${domainName}`;
    fs.appendFile(`${blockPath}/Model/${modelName}_model.ts`, this.modelBody(modelName), function (err: any) {
      if (err) throw err;
    });
  }

  private static modelBody(name: string) {
    if (process.env.DB_CONNECTION != "mongoose") {
      return sqlmodel.modelBody(name);
    } else {
      return noSqlmodel.generateModel(name);
    }
  }

  private static domainExist(name: string) {
    if (fs.existsSync(name)) {
      return true;
    } else {
      return false;
    }
  }
}

export default MakeDomainModelProgram;
