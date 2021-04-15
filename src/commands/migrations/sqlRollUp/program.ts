"use strict";
import BaseCommand from "../../baseCommand";
import shell from "shelljs";
import Ora from "ora";
const spinner = Ora("Processing: ");

class SqlRollUpProgram {
  static async handle(name:string) {
    return name ? this.runSpecifiedMigration(name) : this.runNextMigration();
  }

  //Run the next migration that has not yet been run
  private static runNextMigration() {
    spinner.start();
    spinner.color = "magenta";
    spinner.text = "Running the next migration that has not yet been run: ";
    try {
      shell.exec("npx knex migrate:up --knexfile=./SchemaSetup.ts", (error, success) => {
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
      shell.exec("npx knex migrate:up --knexfile=./SchemaSetup.ts", (error, success) => {
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
   * Run the specified migration that has not yet been run
   * @param {String} name
   */
   private static runSpecifiedMigration(name:string) {
    spinner.start();
    spinner.color = "magenta";
    spinner.text = "Running " + name + " migration that has not yet been run: ";
    try {
      shell.exec("npx knex migrate:up " + name, (error, success) => {
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
      shell.exec("npx knex migrate:up " + name, (error, success) => {
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

export default SqlRollUpProgram;
