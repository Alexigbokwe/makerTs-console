"use strict";
import { promises as fs } from "fs";
import { exec } from "child_process";
import path from "path";
import BaseCommand from "../baseCommand";
import { Arguments, ORM } from "../../Types/CommandTypes";

export class SqlProgram {
  static async handle(name: string, orm: ORM, migration?: Arguments.migration) {
    const spinner = BaseCommand.progress();
    name = name[0].toUpperCase() + name.slice(1);
    const modelName = `${name}Model`;
    const modelPath = path.join("App", "Model");
    const filePath = path.join(modelPath, `${modelName}.ts`);

    spinner.start(`Generating SQL model ${modelName}`);

    try {
      if (await BaseCommand.checkFileExists(filePath)) {
        throw new Error(`${modelName} class already exists`);
      }

      await BaseCommand.checkFolderExists(modelPath);

      if (migration === Arguments.migration) {
        await this.createModelWithMigration(name, orm, filePath, spinner);
      } else {
        await this.createModel(name, orm, filePath, spinner);
      }
    } catch (error) {
      spinner.fail((error as Error).message);
    }
  }

  private static async createModel(modelName: string, orm: ORM, filePath: string, spinner: any) {
    const body = this.modelBody(modelName, orm);
    await fs.writeFile(filePath, body);
    spinner.succeed(`${path.basename(filePath)} class successfully generated in ${path.dirname(filePath)}`);
  }

  private static async createModelWithMigration(modelName: string, orm: ORM, filePath: string, spinner: any) {
    const migrationName = modelName.toLowerCase();
    const command = `npx knex migrate:make ${migrationName} --knexfile=./SchemaSetup.ts`;

    spinner.text = `Generating migration for ${modelName}`;
    await this.executeKnexCommand(command);
    spinner.succeed(`Migration ${migrationName} created successfully.`);

    spinner.start(`Generating model ${modelName}`);
    await this.createModel(modelName, orm, filePath, spinner);
  }

  private static executeKnexCommand(command: string): Promise<void> {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          if (stderr.includes("Cannot find module 'knex'")) {
            console.warn("Knex not found. Attempting to install it globally...");
            exec("npm install knex -g", (installError) => {
              if (installError) {
                return reject(new Error(`Failed to install knex: ${installError.message}`));
              }
              console.log("Knex installed successfully.");
              // Retry the command
              exec(command, (retryError) => {
                if (retryError) {
                  return reject(new Error(`Failed to execute knex command on retry: ${retryError.message}`));
                }
                resolve();
              });
            });
          } else {
            reject(new Error(`Failed to execute knex command: ${error.message}`));
          }
        } else {
          resolve();
        }
      });
    });
  }

  private static TypeORMModelBody(modelName: string, tableName: string) {
    let body = `
    import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

    @Entity('${tableName}')
    export class ${modelName} {
      @PrimaryGeneratedColumn()
      id!: number;
    }`;
    return body;
  }

  private static ObjectionModelBody(modelName: string, tableName: string) {
    let body = `
    import {Model} from "Elucidate/Database/Model";
    
    export class ${modelName} extends Model{
      // Table name
      static tableName = "${tableName}"
      
    }`;
    return body;
  }

  static modelBody(name: string, orm: ORM) {
    let tableName = (name = name[0].toLowerCase() + name.slice(1));
    let modelName = (name = name[0].toUpperCase() + name.slice(1));
    switch (orm) {
      case ORM.Objection:
        return this.ObjectionModelBody(modelName, tableName);
      case ORM.TypeORM:
        return this.TypeORMModelBody(modelName, tableName);
      default:
        throw new Error("Invalid SQL ORM selected");
    }
  }
}
