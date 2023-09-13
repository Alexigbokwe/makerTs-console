"use strict";
import fs from "fs";
import BaseCommand from "../baseCommand";

class ProviderProgram {
  static async handle(name: string) {
    name = name[0].toUpperCase() + name.slice(1);
    let checkFolder = BaseCommand.checkFolderExists("./App/Providers");
    if (checkFolder) {
      let doesFileExist = await BaseCommand.checkFileExists("./App/Providers/" + name + ".ts");
      if (doesFileExist == false) {
        await this.nextStep(name);
      } else {
        return BaseCommand.error(name + ".ts already exist. Modify service provider name and try again");
      }
    }
  }

  private static async nextStep(name: string) {
    fs.appendFile("./App/Providers/" + name + ".ts", this.generateService(name), function (err) {
      if (err) return BaseCommand.error(err.errno);
      BaseCommand.success(name + ".ts class successfully generated in App/Providers folder");
      return true;
    });
  }

  private static generateService(name: string) {
    let body = `
    import ServiceProvider from "Elucidate/Support/ServiceProvider";
    
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

export default ProviderProgram;
