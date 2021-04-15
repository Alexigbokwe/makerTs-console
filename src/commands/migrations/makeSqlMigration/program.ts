"use strict";
import BaseCommand from "../../baseCommand";
import shell from "shelljs";
import Ora from "Ora";
const spinner = Ora("Processing: ");

class MakeSqlMigratiomProgram {
  static async handle(modelName:string) {
    modelName = modelName.toLowerCase();
    spinner.start();
    spinner.color = "magenta";
    spinner.text = "Generating Migration";
    try {
      shell.exec("npx knex migrate:make " + modelName +"knex --knexfile=./SchemaSetup.ts");
      await BaseCommand.success(
        "\n" +
          modelName +
          " migration successfully generated in Database/Migrations folder",
      );
      spinner.color = "green";
      spinner.text = "Completed";
      spinner.succeed("Done 😊😘");
    } catch (error) {
      shell.exec("npm install knex -g");
      shell.exec("npx knex migrate:make " + modelName +"knex --knexfile=./SchemaSetup.ts");
      await BaseCommand.success(
        "\n" +
          modelName +
          " migration successfully generated in Database/Migrations folder",
      );
      spinner.color = "green";
      spinner.text = "Completed";
      spinner.succeed("Done 😊😘");
    }
  }
}

export default MakeSqlMigratiomProgram;
