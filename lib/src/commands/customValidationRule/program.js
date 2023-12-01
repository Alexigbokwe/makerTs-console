"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomValidationRuleProgram = void 0;
const fs_1 = __importDefault(require("fs"));
const baseCommand_1 = __importDefault(require("../baseCommand"));
class CustomValidationRuleProgram {
    static async handle(name) {
        name = name[0].toUpperCase() + name.slice(1);
        let checkFolder = baseCommand_1.default.checkFolderExists("./App/Rules");
        if (checkFolder) {
            let doesFileExist = await baseCommand_1.default.checkFileExists("./App/Rules/" + name + ".ts");
            if (doesFileExist == false) {
                await this.nextStep(name);
            }
            else {
                return baseCommand_1.default.error(name + ".ts already exist. Modify rule name and try again");
            }
        }
    }
    static async nextStep(name) {
        fs_1.default.appendFile("./App/Rules/" + name + ".ts", this.generateRule(name), function (err) {
            if (err)
                return baseCommand_1.default.error(err.errno);
            baseCommand_1.default.success(name + ".ts class successfully generated in App/Rules folder");
            return true;
        });
    }
    static generateRule(name) {
        let body = `"use strict";
    import Rule from "Elucidate/Validator/Rule";

    class ${name} extends Rule{
        /**
         * Determin if the validation rule passes.
         * @param {string} attribute
         * @param {string | number | boolean} value
         * @returns boolean
         */
        public passes(value: string | number| boolean): boolean {
          //
        }
      
        /**
         * Get the validation error message
         * @returns string
         */
        public errorMessage(): string {
          return "The validation error message";
        }
    }

    new ${name}();`;
        return body;
    }
}
exports.CustomValidationRuleProgram = CustomValidationRuleProgram;
