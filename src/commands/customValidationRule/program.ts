"use strict";
import { promises as fs } from "fs";
import BaseCommand from "../baseCommand";
import path from "path";

export class CustomValidationRuleProgram {
  static async handle(name: string) {
    const spinner = BaseCommand.progress();
    name = name[0].toUpperCase() + name.slice(1);
    const rulePath = path.join("App", "Rules");
    const filePath = path.join(rulePath, `${name}.ts`);

    spinner.start(`Generating custom validation rule ${name}`);

    try {
      if (await BaseCommand.checkFileExists(filePath)) {
        throw new Error(`${name}.ts already exists. Modify rule name and try again`);
      }

      await BaseCommand.checkFolderExists(rulePath);
      await this.nextStep(name, filePath);
      spinner.succeed(`Custom validation rule ${name} created successfully.`);
    } catch (error) {
      spinner.fail((error as Error).message);
    }
  }

  private static async nextStep(name: string, filePath: string) {
    await fs.writeFile(filePath, this.generateRule(name));
    BaseCommand.success(`${name}.ts class successfully generated in App/Rules folder`);
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
