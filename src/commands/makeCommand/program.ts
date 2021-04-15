"use strict";
import fs from "fs";
import BaseCommand from "../baseCommand";


class ConsoleProgram {
  static async handle(name:string) {
    name = name[0].toUpperCase() + name.slice(1);
    let checkFolder = BaseCommand.checkFolderExists("./App/Console/Commands");
    if (checkFolder) {
      let doesFileExist = await BaseCommand.checkFileExists(
        "./App/Console/Commands/" + name + "_command.ts",
      );
      if (doesFileExist == false) {
        await this.nextStep(name);
      } else {
        return BaseCommand.error(
          name + "_command.ts already exist. Modify command name and try again",
        );
      }
    }
  }

  private static async nextStep(name:string) {
    fs.appendFile(
      "./App/Console/Commands/" + name + "_command.ts",
      this.generateCommand(name),
      function (err) {
        if (err) return BaseCommand.error(err.errno);
        BaseCommand.success(
          name +
            "_command.ts class successfully generated in App/Console/Commands folder",
        );
        return true;
      },
    );
  }

  private static generateCommand(name:string) {
    let body = `"use strict";
    import Command from "maker-console-ts";

    class ${name} extends Command {
      constructor() {
        super();
        /**
         * The name and signature of the console command.
         * @var string
         */
        this.signature = "";
    
        /**
         * The name and mode of the console command argument.
         * name is the name of the argument while mode can be REQUIRED or OPTIONAL
         * Example [{name: "Debug", mode: "REQUIRED"},{name: "Task", mode: "REQUIRED"}]
         * @var array
         */
        this.arguments = [];
    
        /**
         * The console command description.
         * @var string
         */
        this.description = "";
    
        super.checkCommandName(this.signature);
      }
    
      /**
       * Execute the console command.
       *
       * @return mixed
       */
      fire() {
        //
      }
    }
    
    export default ${name};`;
    return body;
  }
}

export default ConsoleProgram;
