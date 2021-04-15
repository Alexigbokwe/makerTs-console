"use strict";
import BaseCommand from "../../baseCommand";
import shell from "shelljs";
import Ora from "ora";
const spinner = Ora("Processing: ");

class SqlRollDownProgram {
  static async handle(name:string) {
    return name
      ? await this.undoSpecifiedMigration(name)
      : await this.undoLastMigraation();
  }

  //Undo the last migration that was run
  private static async undoLastMigraation() {
    spinner.start();
    spinner.color = "magenta";
    spinner.text = "Undoing the last migration that was run: ";
    try {
      shell.exec("npx knex migrate:down --knexfile=./SchemaSetup.ts", (error, success) => {
        if (error) {
          BaseCommand.error(error);
          spinner.color = "red";
          spinner.text = "failed";
          spinner.fail("");
        }
        if (success) {
          BaseCommand.success(success);
          spinner.color = "green";
          spinner.text = "Completed";
          spinner.succeed("Done 😊😘");
        }
      });
    } catch (error) {
      shell.exec("npm install knex -g");
      shell.exec("npx knex migrate:down --knexfile=./SchemaSetup.ts", (error, success) => {
        if (error) {
          BaseCommand.error(error);
          spinner.color = "red";
          spinner.text = "failed";
          spinner.fail("");
        }
        if (success) {
          BaseCommand.success(success);
          spinner.color = "green";
          spinner.text = "Completed";
          spinner.succeed("Done 😊😘");
        }
      });
    }
  }

  /**
   * Undo the specified migration that was run
   * @param {String} name
   */
   private static async undoSpecifiedMigration(name:string) {
    spinner.start();
    spinner.color = "magenta";
    spinner.text = "Undoing " + name + " migration that was run: ";
    try {
      shell.exec("npx knex migrate:down " + name + "--knexfile=./SchemaSetup.ts", (error, success) => {
        if (error) {
          BaseCommand.error(error);
          spinner.color = "red";
          spinner.text = "failed";
          spinner.fail("");
        }
        if (success) {
          BaseCommand.success(success);
          spinner.color = "green";
          spinner.text = "Completed";
          spinner.succeed("Done 😊😘");
        }
      });
    } catch (error) {
      shell.exec("npm install knex -g");
      shell.exec("npx knex migrate:down " + name + "--knexfile=./SchemaSetup.ts", (error, success) => {
        if (error) {
          BaseCommand.error(error);
          spinner.color = "red";
          spinner.text = "failed";
          spinner.fail("");
        }
        if (success) {
          BaseCommand.success(success);
          spinner.color = "green";
          spinner.text = "Completed";
          spinner.succeed("Done 😊😘");
        }
      });
    }
  }
}

export default SqlRollDownProgram;
