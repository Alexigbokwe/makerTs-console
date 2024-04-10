"use strict";
import fs from "fs";
import BaseCommand from "../baseCommand";
import config from "../../config";

export class ConsoleProgram {
  static async handle(name: string) {
    name = name[0].toUpperCase() + name.slice(1);
    this.doesCommandNameAlreadyExist(name);
    let checkFolder = BaseCommand.checkFolderExists("./App/Console/Commands");
    if (checkFolder) {
      let doesFileExist = await BaseCommand.checkFileExists("./App/Console/Commands/" + name + ".ts");
      if (!doesFileExist) {
        await this.nextStep(name);
      } else {
        return BaseCommand.error(name + ".ts already exist. Modify command name and try again");
      }
    }
  }

  private static doesCommandNameAlreadyExist(name: string) {
    if (config.has(name)) {
      throw new Error(`${name} commend already exist. Modify command name and try again`);
    }
  }

  private static async nextStep(name: string) {
    fs.appendFile("./App/Console/Commands/" + name + ".ts", this.generateCommand(name), function (err) {
      if (err) return BaseCommand.error(err.errno);
      BaseCommand.success(name + ".ts class successfully generated in App/Console/Commands folder");
      return true;
    });
  }

  private static generateCommand(name: string) {
    let body = `
    import {Command, CommandArgument} from "maker-console-ts";

    export class ${name} extends Command {
      /**
       * The name or signature of the console command.
      */
      public signature = "";

      /**
       * Argument name and mode of the console command.
       * name is the name of the argument while mode can be REQUIRED or OPTIONAL
       * Example [{name: "Debug", mode: "REQUIRED"},{name: "Task", mode: "REQUIRED"}]
       */
      public arguments?: CommandArgument = [];

      /**
       * The console command description.
       */
      public description = "";
    
      /**
       * Execute the console command.
       */
      public fire<T>(data?: T): void {
        //
      }
    }`;
    return body;
  }
}
