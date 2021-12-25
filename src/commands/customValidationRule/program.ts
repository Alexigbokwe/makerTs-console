"use strict";
import fs from "fs";
import BaseCommand from "../baseCommand";

class CustomValidationRuleProgram {
  static async handle(name: string) {
    name = name[0].toUpperCase() + name.slice(1);
    let checkFolder = BaseCommand.checkFolderExists("./App/Rules");
    if (checkFolder) {
      let doesFileExist = await BaseCommand.checkFileExists("./App/Rules/" + name + ".ts");
      if (doesFileExist == false) {
        await this.nextStep(name);
      } else {
        return BaseCommand.error(name + ".ts already exist. Modify rule name and try again");
      }
    }
  }

  private static async nextStep(name: string) {
    fs.appendFile("./App/Rules/" + name + ".ts", this.generateRule(name), function (err) {
      if (err) return BaseCommand.error(err.errno);
      BaseCommand.success(name + ".ts class successfully generated in App/Rules folder");
      return true;
    });
  }

  private static generateRule(name: string) {
    let body = `"use strict";
    import Rule from "Elucidate/Validator/Rule";

    class ${name} extends Rule{
        /**
         * Determin if the validation rule passes.
         * @param {string} attribute
         * @param {string | number | boolean} value
         * @returns boolean
         */
        public passes(value: string | number): boolean {
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

export default CustomValidationRuleProgram;
