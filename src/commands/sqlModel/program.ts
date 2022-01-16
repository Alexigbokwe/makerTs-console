"use strict";
import Ora from "ora";
import fs from "fs";
import BaseCommand from "../baseCommand";
import shell from "shelljs";
const spinner = Ora("Processing: ");

class SqlProgram {
  static async handle(name: string, resource = null) {
    name = name[0].toUpperCase() + name.slice(1);
    let check = await BaseCommand.checkFileExists("./App/Model/" + name + "_model.ts");
    if (check == false) {
      await this.createModel(name, resource);
    } else {
      return BaseCommand.error(`${name} Sql model class already exists`);
    }
  }

  private static async createModel(modelName: string, resource: string | null) {
    if (resource == "Generation migration with sql model") {
      spinner.start();
      spinner.color = "magenta";
      spinner.text = "Generating Model";
      fs.appendFile("./App/Model/" + modelName + "_model.ts", await this.modelBodyWithMigration(modelName), function (err) {
        if (err) BaseCommand.error(err);
        BaseCommand.success("\n" + modelName + "_model.ts class successfully generated in App/Model folder");
        spinner.color = "green";
        spinner.text = "Completed";
        spinner.succeed("Done 😊😘");
      });
    } else {
      spinner.start();
      spinner.color = "magenta";
      spinner.text = "Generating Model";
      fs.appendFile("./App/Model/" + modelName + "_model.ts", this.modelBody(modelName), function (err) {
        if (err) BaseCommand.error(err);
        BaseCommand.success("\n" + modelName + "_model.ts class successfully generated in App/Model folder");
        spinner.color = "green";
        spinner.text = "Completed";
        spinner.succeed("Done 😊😘");
      });
    }
  }

  private static TypeORMModelBody(modelName: string, tableName: string) {
    let body = `"use strict";
    import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

    @Entity('${tableName}')
    class ${modelName} {
      @PrimaryGeneratedColumn()
      id!: number;
    }
    export default ${modelName};`;
    return body;
  }

  private static ObjecionModelBody(modelName: string, tableName: string) {
    let body = `"use strict";
    import {Model} from "Elucidate/Database/Model";
    class ${modelName} extends Model{
      // Table name
      static tableName = "${tableName}"
      
    }

    export default ${modelName};`;
    return body;
  }

  static modelBody(name: string) {
    let tableName = (name = name[0].toLowerCase() + name.slice(1));
    let modelName = (name = name[0].toUpperCase() + name.slice(1));
    switch (process.env.ORM) {
      case "TypeORM":
        return this.TypeORMModelBody(modelName, tableName);
      case "ObjectionWithKnex":
        return this.ObjecionModelBody(modelName, tableName);
      default:
        throw new Error("Invalid ORM Selected. Accepted ORMs Are Objection, TypeORM");
    }
  }

  private static async modelBodyWithMigration(modelName: string) {
    modelName = modelName.toLowerCase();
    try {
      shell.exec("npx knex migrate:make " + modelName + " --knexfile=./SchemaSetup.ts");
      await BaseCommand.success(modelName + " migration successfully generated in Database/Migrations folder");
      return this.modelBody(modelName);
    } catch (error) {
      shell.exec("npm install knex -g");
      shell.exec("npx knex migrate:make " + modelName + " --knexfile=./SchemaSetup.ts");
      await BaseCommand.success(modelName + " migration successfully generated in Database/Migrations folder");
      return this.modelBody(modelName);
    }
  }
}

export default SqlProgram;
