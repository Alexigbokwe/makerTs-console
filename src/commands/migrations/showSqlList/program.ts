"use strict";
import BaseCommand from "../../baseCommand";
import { exec } from "child_process";

class ShowSqlListProgram {
  static async handle() {
    const spinner = BaseCommand.progress();
    spinner.start("Generating Migration List");

    const command = "npx knex migrate:list --knexfile=./SchemaSetup.ts";

    exec(command, (error, stdout, stderr) => {
      if (error) {
        spinner.fail(`Failed to generate migration list: ${error.message}`);
        if (stderr.includes("Cannot find module 'knex'")) {
          BaseCommand.warning("Knex not found. Attempting to install it globally...");
          exec("npm install knex -g", (installError) => {
            if (installError) {
              spinner.fail(`Failed to install knex: ${installError.message}`);
              return;
            }
            spinner.succeed("Knex installed successfully.");
            spinner.start("Retrying migration list generation...");
            exec(command, (retryError, retryStdout) => {
              if (retryError) {
                spinner.fail(`Failed to generate migration list on retry: ${retryError.message}`);
                return;
              }
              BaseCommand.success(retryStdout);
              spinner.succeed("Migration list generated successfully.");
            });
          });
        }
        return;
      }
      BaseCommand.success(stdout);
      spinner.succeed("Migration list generated successfully.");
    });
  }
}

export default ShowSqlListProgram;
