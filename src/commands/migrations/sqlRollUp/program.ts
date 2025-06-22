"use strict";
import BaseCommand from "../../baseCommand";
import { exec } from "child_process";

export class SqlRollUpProgram {
  static async handle(name: string) {
    const spinner = BaseCommand.progress();
    const migrationName = name || "";
    const spinnerText = name ? `Running ${name} migration` : "Running the next migration";
    spinner.start(spinnerText);

    const command = `npx knex migrate:up ${migrationName} --knexfile=./SchemaSetup.ts`;

    this.executeCommand(spinner, command);
  }

  private static executeCommand(spinner: any, command: string) {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        spinner.fail(`Failed to run rollup: ${error.message}`);
        if (stderr.includes("Cannot find module 'knex'")) {
          BaseCommand.warning("Knex not found. Attempting to install it globally...");
          exec("npm install knex -g", (installError) => {
            if (installError) {
              spinner.fail(`Failed to install knex: ${installError.message}`);
              return;
            }
            spinner.succeed("Knex installed successfully.");
            spinner.start("Retrying rollup...");
            exec(command, (retryError, retryStdout) => {
              if (retryError) {
                spinner.fail(`Failed to run rollup on retry: ${retryError.message}`);
                return;
              }
              BaseCommand.success(retryStdout);
              spinner.succeed("Rollup completed successfully.");
            });
          });
        }
        return;
      }
      BaseCommand.success(stdout);
      spinner.succeed("Rollup completed successfully.");
    });
  }
}
