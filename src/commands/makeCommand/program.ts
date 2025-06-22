"use strict";
import { promises as fs } from "fs";
import BaseCommand from "../baseCommand";
import path from "path";
import { Console } from "../../index";

export class ConsoleProgram {
  static async handle(name: string) {
    name = name[0].toUpperCase() + name.slice(1);
    Console.checkCommandName(name);
    const commandPath = path.join("App", "Console", "Commands");
    const filePath = path.join(commandPath, `${name}.ts`);

    if (await BaseCommand.checkFileExists(filePath)) {
      return BaseCommand.error(`${name}.ts already exists. Modify command name and try again`);
    }

    if (await BaseCommand.checkFolderExists(commandPath)) {
      await this.nextStep(name, filePath);
    }
  }

  private static async nextStep(name: string, filePath: string) {
    try {
      await fs.writeFile(filePath, this.generateCommand(name));
      BaseCommand.success(`${name}.ts class successfully generated in App/Console/Commands folder`);
    } catch (err) {
      BaseCommand.error((err as Error).message);
    }
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
