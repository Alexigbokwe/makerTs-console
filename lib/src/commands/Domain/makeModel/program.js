"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ora_1 = __importDefault(require("ora"));
const fs_1 = __importDefault(require("fs"));
const baseCommand_1 = __importDefault(require("../../baseCommand"));
const spinner = (0, ora_1.default)("Processing: ");
const program_1 = __importDefault(require("../../sqlModel/program"));
const program_2 = __importDefault(require("../../nosqlModel/program"));
class MakeDomainModelProgram {
    static async handle(modelName, domainName) {
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
                await this.nextStep(modelName, domainName);
                spinner.color = "green";
                spinner.text = "Completed";
                spinner.succeed(`${modelName} model successfull generated in Domain/${domainName}/Model directory.`);
            }
        }
        catch (error) {
            spinner.color = "red";
            spinner.text = "failed";
            spinner.fail("");
            baseCommand_1.default.error(error);
        }
    }
    static async nextStep(modelName, domainName) {
        let blockPath = `./Domains/${domainName}`;
        fs_1.default.appendFile(`${blockPath}/Model/${modelName}_model.ts`, this.modelBody(modelName), function (err) {
            if (err)
                throw err;
        });
    }
    static modelBody(name) {
        if (process.env.DB_CONNECTION != "mongoose") {
            return program_1.default.modelBody(name);
        }
        else {
            return program_2.default.generateModel(name);
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
