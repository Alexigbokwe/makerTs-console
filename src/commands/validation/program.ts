"use strict";
import { promises as fs } from "fs";
import BaseCommand from "../baseCommand";
import path from "path";

export class ValidationProgram {
  static async handle(name: string) {
    const spinner = BaseCommand.progress();
    name = name[0].toUpperCase() + name.slice(1);
    const validationName = name.includes("Validation") ? name : `${name}Validation`;
    const validationPath = path.join("App", "Http", "Validation");
    const filePath = path.join(validationPath, `${validationName}.ts`);

    spinner.start(`Generating validation ${validationName}`);

    try {
      if (await BaseCommand.checkFileExists(filePath)) {
        throw new Error(`${validationName}.ts already exists. Modify request validator name and try again`);
      }

      await BaseCommand.checkFolderExists(validationPath);
      await this.nextStep(validationName, filePath);
      spinner.succeed(`Validation ${validationName} created successfully.`);
    } catch (error) {
      spinner.fail((error as Error).message);
    }
  }

  private static async nextStep(validationName: string, filePath: string) {
    await fs.writeFile(filePath, this.generateValidation(validationName));
    BaseCommand.success(`${validationName}.ts class successfully generated in App/Http/Validation folder`);
  }

  private static generateValidation(name: string) {
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
