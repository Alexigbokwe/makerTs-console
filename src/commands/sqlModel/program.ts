"use strict";
import Ora from "ora";
import fs from "fs";
import BaseCommand from "../baseCommand";
import shell from "shelljs";
import { Arguments, ORM } from "../../Types/CommandTypes";
const spinner = Ora("Processing: ");

export class SqlProgram {
  static async handle(name: string, orm: ORM, migration?: Arguments.migration) {
    name = name[0].toUpperCase() + name.slice(1);
    let check = await BaseCommand.checkFileExists("./App/Model/" + name + "Model.ts");
    if (!check) {
      await this.createModel(name, orm, migration);
    } else {
      return BaseCommand.error(`${name} Sql model class already exists`);
    }
  }

  private static async createModel(modelName: string, orm: ORM, migration?: Arguments.migration) {
    if (migration === Arguments.migration) {
      spinner.start();
      spinner.color = "magenta";
      spinner.text = "Generating Model";
      fs.appendFile("./App/Model/" + modelName + "Model.ts", await this.modelBodyWithMigration(modelName, orm), function (err) {
        if (err) BaseCommand.error(err);
        BaseCommand.success("\n" + modelName + "Model.ts class successfully generated in App/Model folder");
        spinner.color = "green";
        spinner.text = "Completed";
        spinner.succeed("Done 😊😘");
      });
    } else {
      spinner.start();
      spinner.color = "magenta";
      spinner.text = "Generating Model";
      fs.appendFile("./App/Model/" + modelName + "Model.ts", this.modelBody(modelName, orm), function (err) {
        if (err) BaseCommand.error(err);
        BaseCommand.success("\n" + modelName + "Model.ts class successfully generated in App/Model folder");
        spinner.color = "green";
        spinner.text = "Completed";
        spinner.succeed("Done 😊😘");
      });
    }
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

  private static async modelBodyWithMigration(modelName: string, orm: ORM) {
    modelName = modelName.toLowerCase();
    try {
      shell.exec("npx knex migrate:make " + modelName + " --knexfile=./SchemaSetup.ts");
      await BaseCommand.success(modelName + " migration successfully generated in Database/Migrations folder");
      return this.modelBody(modelName, orm);
    } catch (error) {
      shell.exec("npm install knex -g");
      shell.exec("npx knex migrate:make " + modelName + " --knexfile=./SchemaSetup.ts");
      await BaseCommand.success(modelName + " migration successfully generated in Database/Migrations folder");
      return this.modelBody(modelName, orm);
    }
  }
}
