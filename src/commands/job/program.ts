"use strict";
import fs from "fs";
import BaseCommand from "../baseCommand";

class JobProgram {
  static async handle(name: string) {
    name = name[0].toUpperCase() + name.slice(1);
    let checkFolder = BaseCommand.checkFolderExists("./App/Jobs");
    if (checkFolder) {
      let doesFileExist = await BaseCommand.checkFileExists("./App/Jobs/" + name + "_job.ts");
      if (doesFileExist == false) {
        await this.nextStep(name);
      } else {
        return BaseCommand.error(name + "_job.ts already exist. Modify job name and try again");
      }
    }
  }

  private static async nextStep(name: string) {
    fs.appendFile("./App/Jobs/" + name + "_job.ts", this.generateJob(name), function (err) {
      if (err) return BaseCommand.error(err.errno);
      BaseCommand.success(name + "_job.ts class successfully generated in App/Jobs folder");
      return true;
    });
  }

  private static generateJob(name: string) {
    let body = `
    import ShouldQueue from "expresswebcorets/lib/Queue/shoudQueue";

    class ${name} extends ShouldQueue{
      public signature = "${name}_job";

      constructor() {
        super();
        this.queueSignature(this.signature);
      }
      
      /**
       * Execute the job.
       * @return void
       */
      handle<T>(data:T): void {
        //
      }
    }

    export default ${name};`;
    return body;
  }
}

export default JobProgram;
