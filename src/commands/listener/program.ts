"use strict";
import fs from "fs";
import BaseCommand from "../baseCommand";

export class ListenerProgram {
  static async handle(name: string) {
    name = name[0].toUpperCase() + name.slice(1);
    let checkFolder = BaseCommand.checkFolderExists("./App/Listeners");
    if (checkFolder) {
      let doesFileExist = await BaseCommand.checkFileExists("./App/Listeners/" + name + "_listener.ts");
      if (doesFileExist == false) {
        await this.nextStep(name);
      } else {
        return BaseCommand.error(name + "_listener.ts already exist. Modify listener name and try again");
      }
    }
  }

  private static async nextStep(name: string) {
    fs.appendFile("./App/Listeners/" + name + "_listener.ts", this.generateListener(name), function (err) {
      if (err) return BaseCommand.error(err.errno);
      BaseCommand.success(name + "_listener.ts class successfully generated in App/Listeners folder");
      return true;
    });
  }

  private static generateListener(name: string) {
    let body = `"use strict";
    import Emitter from "Elucidate/Emitter";

    class ${name}<T> {
      /**
       * Handle the event.
       * @param {*} eventName
       * @param {*} params
       */
      constructor(eventName:string, params:T) {
        Emitter.bind(eventName, () => {
          //Do something
        });
      }
    }

    export default ${name};`;
    return body;
  }
}
