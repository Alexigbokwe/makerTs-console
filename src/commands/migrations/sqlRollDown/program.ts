"use strict";
import BaseCommand from "../../baseCommand";
import { exec } from "child_process";

export class SqlRollDownProgram {
  static async handle(name: string) {
    const spinner = BaseCommand.progress();
    const migrationName = name || "";
    const spinnerText = name ? `Undoing ${name} migration` : "Undoing the last migration";
    spinner.start(spinnerText);

    const command = `npx knex migrate:down ${migrationName} --knexfile=./SchemaSetup.ts`;

    this.executeCommand(spinner, command);
  }

  private static executeCommand(spinner: any, command: string) {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        spinner.fail(`Failed to run rolldown: ${error.message}`);
        if (stderr.includes("Cannot find module 'knex'")) {
          BaseCommand.warning("Knex not found. Attempting to install it globally...");
          exec("npm install knex -g", (installError) => {
            if (installError) {
              spinner.fail(`Failed to install knex: ${installError.message}`);
              return;
            }
            spinner.succeed("Knex installed successfully.");
            spinner.start("Retrying rolldown...");
            exec(command, (retryError, retryStdout) => {
              if (retryError) {
                spinner.fail(`Failed to run rolldown on retry: ${retryError.message}`);
                return;
              }
              BaseCommand.success(retryStdout);
              spinner.succeed("Rolldown completed successfully.");
            });
          });
        }
        return;
      }
      BaseCommand.success(stdout);
      spinner.succeed("Rolldown completed successfully.");
    });
  }
}
