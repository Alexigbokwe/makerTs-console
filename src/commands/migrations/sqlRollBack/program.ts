"use strict";
import BaseCommand from "../../baseCommand";
import shell from "shelljs";
import Ora from "ora";
const spinner = Ora("Processing: ");

class SqlRollBackProgram {
  static async handle(all: any) {
    return all ? this.runAll() : this.runNormal();
  }

  private static async runAll() {
    spinner.start();
    spinner.color = "magenta";
    spinner.text = "Rolling back all the completed migrations: ";
    try {
      shell.exec(
        "npx knex migrate:rollback --all --knexfile=./SchemaSetup.ts",
        (error, success) => {
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
        },
      );
    } catch (error) {
      shell.exec("npm install knex -g");
      shell.exec(
        "npx knex migrate:rollback --all --knexfile=./SchemaSetup.ts",
        (error, success) => {
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
        },
      );
    }
  }

  private static async runNormal() {
    spinner.start();
    spinner.color = "magenta";
    spinner.text = "Rolling back the last batch of migrations: ";
    try {
      shell.exec(
        "npx knex migrate:rollback --knexfile=./SchemaSetup.ts",
        (error, success) => {
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
        },
      );
    } catch (error) {
      shell.exec("npm install knex -g");
      shell.exec(
        "npx knex migrate:rollback --knexfile=./SchemaSetup.ts",
        (error, success) => {
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
        },
      );
    }
  }
}

export default SqlRollBackProgram;
