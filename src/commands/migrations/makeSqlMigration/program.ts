"use strict";
import BaseCommand from "../../baseCommand";
import { exec } from "child_process";

export class MakeSqlMigrationProgram {
  static async handle(modelName: string) {
    modelName = modelName.toLowerCase();
    const spinner = BaseCommand.progress();
    spinner.start("Generating Migration");

    const command = `npx knex migrate:make ${modelName} --knexfile=./SchemaSetup.ts`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        spinner.fail(`Failed to generate migration: ${error.message}`);
        if (stderr.includes("Cannot find module 'knex'")) {
          BaseCommand.warning("Knex not found. Attempting to install it globally...");
          exec("npm install knex -g", (installError) => {
            if (installError) {
              spinner.fail(`Failed to install knex: ${installError.message}`);
              return;
            }
            spinner.succeed("Knex installed successfully.");
            spinner.start("Retrying migration generation...");
            exec(command, (retryError) => {
              if (retryError) {
                spinner.fail(`Failed to generate migration on retry: ${retryError.message}`);
                return;
              }
              spinner.succeed(`Migration ${modelName} created successfully.`);
            });
          });
        }
        return;
      }
      spinner.succeed(`Migration ${modelName} created successfully.`);
    });
  }
}
