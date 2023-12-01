"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ora_1 = __importDefault(require("ora"));
const fs_1 = __importDefault(require("fs"));
const baseCommand_1 = __importDefault(require("../../baseCommand"));
const spinner = (0, ora_1.default)("Processing: ");
const program_1 = require("../../sqlModel/program");
const program_2 = require("../../nosqlModel/program");
const CommandTypes_1 = require("../../../Types/CommandTypes");
class MakeDomainModelProgram {
    static async handle(modelName, domainName, orm) {
        spinner.start();
        spinner.color = "magenta";
        domainName = domainName[0].toUpperCase() + domainName.slice(1);
        modelName = modelName[0].toUpperCase() + modelName.slice(1);
        spinner.text = "Generating " + modelName + "Model in " + domainName + " Domain";
        try {
            if (!this.domainExist("./Domains/" + domainName)) {
                throw new Error(domainName + " domain does not exist, kindly create it using 'ts-node maker make-domain " + domainName + "'");
            }
            else {
                await this.nextStep(modelName, domainName, orm);
                spinner.color = "green";
                spinner.text = "Completed";
                spinner.succeed(`${modelName} model successfully generated in Domain/${domainName}/Model directory.`);
            }
        }
        catch (error) {
            spinner.color = "red";
            spinner.text = "failed";
            spinner.fail("");
            baseCommand_1.default.error(error);
        }
    }
    static async nextStep(modelName, domainName, orm) {
        const blockPath = `./Domains/${domainName}`;
        fs_1.default.appendFile(`${blockPath}/Model/${modelName}_model.ts`, this.modelBody(modelName, orm), function (err) {
            if (err)
                throw err;
        });
    }
    static modelBody(name, orm) {
        if (orm !== CommandTypes_1.ORM.Mongoose) {
            return program_1.SqlProgram.modelBody(name, orm);
        }
        else {
            return program_2.NoSqlProgram.generateModel(name);
        }
    }
    static domainExist(name) {
        if (fs_1.default.existsSync(name)) {
            return true;
        }
        else {
            return false;
        }
    }
}
exports.default = MakeDomainModelProgram;
