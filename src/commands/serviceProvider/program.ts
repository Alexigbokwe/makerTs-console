"use strict";
import { promises as fs } from "fs";
import BaseCommand from "../baseCommand";
import path from "path";

export class ProviderProgram {
  static async handle(name: string) {
    const spinner = BaseCommand.progress();
    name = name[0].toUpperCase() + name.slice(1);
    const providerPath = path.join("App", "Providers");
    const filePath = path.join(providerPath, `${name}.ts`);

    spinner.start(`Generating service provider ${name}`);

    try {
      if (await BaseCommand.checkFileExists(filePath)) {
        throw new Error(`${name}.ts already exists. Modify service provider name and try again`);
      }

      await BaseCommand.checkFolderExists(providerPath);
      await this.nextStep(name, filePath);
      spinner.succeed(`Service provider ${name} created successfully.`);
    } catch (error) {
      spinner.fail((error as Error).message);
    }
  }

  private static async nextStep(name: string, filePath: string) {
    await fs.writeFile(filePath, this.generateService(name));
    BaseCommand.success(`${name}.ts class successfully generated in App/Providers folder`);
  }

  private static generateService(name: string) {
    let body = `
    import {ServiceProvider} from "Elucidate/Support/ServiceProvider";
    
    export class ${name} extends ServiceProvider{
      /**
       * Register application services.
       * @return void
      */
      public register():void {
          //
      }

      /**
       * Bootstrap any application services.
       * @return void
      */
      public async boot():Promise<void> {
          //
      }
    }`;
    return body;
  }
}
