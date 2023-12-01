"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SqlProgram = void 0;
const ora_1 = __importDefault(require("ora"));
const fs_1 = __importDefault(require("fs"));
const baseCommand_1 = __importDefault(require("../baseCommand"));
const shelljs_1 = __importDefault(require("shelljs"));
const CommandTypes_1 = require("../../Types/CommandTypes");
const spinner = (0, ora_1.default)("Processing: ");
class SqlProgram {
    static async handle(name, orm, migration) {
        name = name[0].toUpperCase() + name.slice(1);
        let check = await baseCommand_1.default.checkFileExists("./App/Model/" + name + "Model.ts");
        if (!check) {
            await this.createModel(name, orm, migration);
        }
        else {
            return baseCommand_1.default.error(`${name} Sql model class already exists`);
        }
    }
    static async createModel(modelName, orm, migration) {
        if (migration === CommandTypes_1.Arguments.migration) {
            spinner.start();
            spinner.color = "magenta";
            spinner.text = "Generating Model";
            fs_1.default.appendFile("./App/Model/" + modelName + "Model.ts", await this.modelBodyWithMigration(modelName, orm), function (err) {
                if (err)
                    baseCommand_1.default.error(err);
                baseCommand_1.default.success("\n" + modelName + "Model.ts class successfully generated in App/Model folder");
                spinner.color = "green";
                spinner.text = "Completed";
                spinner.succeed("Done 😊😘");
            });
        }
        else {
            spinner.start();
            spinner.color = "magenta";
            spinner.text = "Generating Model";
            fs_1.default.appendFile("./App/Model/" + modelName + "Model.ts", this.modelBody(modelName, orm), function (err) {
                if (err)
                    baseCommand_1.default.error(err);
                baseCommand_1.default.success("\n" + modelName + "Model.ts class successfully generated in App/Model folder");
                spinner.color = "green";
                spinner.text = "Completed";
                spinner.succeed("Done 😊😘");
            });
        }
    }
    static TypeORMModelBody(modelName, tableName) {
        let body = `
    import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

    @Entity('${tableName}')
    export class ${modelName} {
      @PrimaryGeneratedColumn()
      id!: number;
    }`;
        return body;
    }
    static ObjectionModelBody(modelName, tableName) {
        let body = `
    import {Model} from "Elucidate/Database/Model";
    
    export class ${modelName} extends Model{
      // Table name
      static tableName = "${tableName}"
      
    }`;
        return body;
    }
    static modelBody(name, orm) {
        let tableName = (name = name[0].toLowerCase() + name.slice(1));
        let modelName = (name = name[0].toUpperCase() + name.slice(1));
        switch (orm) {
            case CommandTypes_1.ORM.Objection:
                return this.ObjectionModelBody(modelName, tableName);
            case CommandTypes_1.ORM.TypeORM:
                return this.TypeORMModelBody(modelName, tableName);
            default:
                throw new Error("Invalid SQL ORM selected");
        }
    }
    static async modelBodyWithMigration(modelName, orm) {
        modelName = modelName.toLowerCase();
        try {
            shelljs_1.default.exec("npx knex migrate:make " + modelName + " --knexfile=./SchemaSetup.ts");
            await baseCommand_1.default.success(modelName + " migration successfully generated in Database/Migrations folder");
            return this.modelBody(modelName, orm);
        }
        catch (error) {
            shelljs_1.default.exec("npm install knex -g");
            shelljs_1.default.exec("npx knex migrate:make " + modelName + " --knexfile=./SchemaSetup.ts");
            await baseCommand_1.default.success(modelName + " migration successfully generated in Database/Migrations folder");
            return this.modelBody(modelName, orm);
        }
    }
}
exports.SqlProgram = SqlProgram;
