"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ora_1 = __importDefault(require("ora"));
const fs_1 = __importDefault(require("fs"));
const baseCommand_1 = __importDefault(require("../../baseCommand"));
const program_1 = __importDefault(require("../../controller/program"));
const spinner = (0, ora_1.default)("Processing: ");
class MakeDomainControllerProgram {
    static async handle(controllerName, domainName, resource) {
        spinner.start();
        spinner.color = "magenta";
        domainName = domainName[0].toUpperCase() + domainName.slice(1);
        controllerName = controllerName[0].toUpperCase() + controllerName.slice(1);
        spinner.text = "Generating " + controllerName + "Controller in " + domainName + " Domain";
        try {
            if (!this.domainExist("./Domains/" + domainName)) {
                throw new Error(domainName + " domain does not exist, kindly create it using 'ts-node maker make-domain " + domainName + "'");
            }
            else {
                await this.nextStep(controllerName, domainName, resource);
                spinner.color = "green";
                spinner.text = "Completed";
                spinner.succeed(`${controllerName}Controller successfully generated in Domain/${domainName}/Http/Controller directory.`);
            }
        }
        catch (error) {
            spinner.color = "red";
            spinner.text = "failed";
            spinner.fail("");
            baseCommand_1.default.error(error);
        }
    }
    static async nextStep(controllerName, domainName, resource) {
        await program_1.default.handle(`${controllerName}Controller`, "Domains/" + domainName + "/Http/Controller", resource);
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
exports.default = MakeDomainControllerProgram;
