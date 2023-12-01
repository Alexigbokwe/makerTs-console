"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationProgram = void 0;
const fs_1 = __importDefault(require("fs"));
const baseCommand_1 = __importDefault(require("../baseCommand"));
class ValidationProgram {
    static async handle(name) {
        name = name[0].toUpperCase() + name.slice(1);
        let checkFolder = baseCommand_1.default.checkFolderExists("./App/Http/Validation");
        if (checkFolder) {
            let doesFileExist = await baseCommand_1.default.checkFileExists("./App/Http/Validation/" + name + "Validation.ts");
            if (doesFileExist == false) {
                await this.nextStep(name);
            }
            else {
                return baseCommand_1.default.error(name + "Validation.ts already exist. Modify request validator name and try again");
            }
        }
    }
    static async nextStep(name) {
        name = name.includes("validation") ? name : name + "Validation";
        const validationName = name.charAt(0).toUpperCase() + name.slice(1);
        fs_1.default.appendFile("./App/Http/Validation/" + validationName + ".ts", this.generateValidation(validationName), function (err) {
            if (err)
                return baseCommand_1.default.error(err.errno);
            baseCommand_1.default.success(validationName + "Validation.ts class successfully generated in App/Http/Validation folder");
            return true;
        });
    }
    static generateValidation(name) {
        let body = `
    import {FormRequest} from "Elucidate/Validator/FormRequest";

    export class ${name} extends FormRequest{
      /**
       * Handle data validation.
       * @param {*} data | e.g request body
       */
       public static async validate<T>(data:T) {
        return await FormRequest.make<T>(data, {
          //Validation rules
        });
      }
    }`;
        return body;
    }
}
exports.ValidationProgram = ValidationProgram;
