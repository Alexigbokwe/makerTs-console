"use strict";
import BaseCommand from "../../baseCommand";
import { exec } from "child_process";

export class SqlRollBackProgram {
  static async handle(all: boolean) {
    const spinner = BaseCommand.progress();
    const allFlag = all ? "--all" : "";
    const spinnerText = all ? "Rolling back all completed migrations" : "Rolling back the last batch of migrations";
    spinner.start(spinnerText);

    const command = `npx knex migrate:rollback ${allFlag} --knexfile=./SchemaSetup.ts`;

    this.executeCommand(spinner, command);
  }

  private static executeCommand(spinner: any, command: string) {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        spinner.fail(`Failed to run rollback: ${error.message}`);
        if (stderr.includes("Cannot find module 'knex'")) {
          BaseCommand.warning("Knex not found. Attempting to install it globally...");
          exec("npm install knex -g", (installError) => {
            if (installError) {
              spinner.fail(`Failed to install knex: ${installError.message}`);
              return;
            }
            spinner.succeed("Knex installed successfully.");
            spinner.start("Retrying rollback...");
            exec(command, (retryError, retryStdout) => {
              if (retryError) {
                spinner.fail(`Failed to run rollback on retry: ${retryError.message}`);
                return;
              }
              BaseCommand.success(retryStdout);
              spinner.succeed("Rollback completed successfully.");
            });
          });
        }
        return;
      }
      BaseCommand.success(stdout);
      spinner.succeed("Rollback completed successfully.");
    });
  }
}
