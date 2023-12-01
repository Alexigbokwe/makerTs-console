"use strict";
import BaseCommand from "../../baseCommand";
import shell from "shelljs";
import Ora from "ora";
const spinner = Ora("Processing: ");

export class RunSqlMigrationProgram {
  static async handle() {
    spinner.start();
    spinner.color = "magenta";
    spinner.text = "Running Migration: ";
    try {
      shell.exec("npx knex migrate:latest --knexfile=./SchemaSetup.ts", (error, success) => {
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
      shell.exec("npx knex migrate:latest --knexfile=./SchemaSetup.ts", (error, success) => {
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
