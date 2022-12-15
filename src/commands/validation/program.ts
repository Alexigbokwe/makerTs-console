"use strict";
import fs from "fs";
import BaseCommand from "../baseCommand";

class ValidationProgram {
  static async handle(name: string) {
    name = name[0].toUpperCase() + name.slice(1);
    let checkFolder = BaseCommand.checkFolderExists("./App/Http/Validation");
    if (checkFolder) {
      let doesFileExist = await BaseCommand.checkFileExists("./App/Http/Validation/" + name + "Validation.ts");
      if (doesFileExist == false) {
        await this.nextStep(name);
      } else {
        return BaseCommand.error(name + "Validation.ts already exist. Modify request validator name and try again");
      }
    }
  }

  private static async nextStep(name: string) {
    name = name.includes("validation") ? name : name + "Validation";
    const validationName = name.charAt(0).toUpperCase() + name.slice(1);
    fs.appendFile("./App/Http/Validation/" + validationName + ".ts", this.generateValidation(validationName), function (err: any) {
      if (err) return BaseCommand.error(err.errno);
      BaseCommand.success(validationName + "Validation.ts class successfully generated in App/Http/Validation folder");
      return true;
    });
  }

  private static generateValidation(name: string) {
    let body = `
    import FormRequest from "Elucidate/Validator/FormRequest";

    export class ${name} extends FormRequest{
      /**
       * Handle data validation.
       * @param {*} data | e.g request body
       */
       static async validate<T>(data:T) {
        return await FormRequest.make<T>(data, {
          //Validation rules
        });
      }
    }`;
    return body;
  }
}

export default ValidationProgram;
