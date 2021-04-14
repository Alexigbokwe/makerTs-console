"use strict";
import fs from "fs";
import BaseCommand from "../baseCommand";

class EventProgram {
  static async handle(name:string) {
    name = name[0].toUpperCase() + name.slice(1);
    let checkFolder = BaseCommand.checkFolderExists("./App/Events");
    if (checkFolder) {
      let doesFileExist = await BaseCommand.checkFileExists(
        "./App/Events/" + name + "_event.ts",
      );
      if (doesFileExist == false) {
        await this.nextStep(name);
      } else {
        return BaseCommand.error(
          name + "_event.ts already exist. Modify event name and try again",
        );
      }
    } 
  }

  private static async nextStep(name:string) {
    fs.appendFile(
      "./App/Events/" + name + "_event.ts",
      this.generateEvent(name),
      function (err) {
        if (err) return BaseCommand.error(err.errno);
        BaseCommand.success(
          name + "_event.ts class successfully generated in App/Events folder",
        );
        return true;
      },
    );
  }

  private static generateEvent(name:string) {
    let body = `"use strict";
    import emitter from "Elucidate/Emitter";

    class ${name} {
      /**
       * Create a new event instance.
       * @param {*} params
       */
      constructor(params) {
        this.params = params;
        this.listenOn();
        emitter.emit("${name}");
      }

      /**
       * Get the listener to listen to the event.
       */
      public async listenOn() {
        //
      }
    }

    export default ${name};`;
    return body;
  }
}

export default EventProgram;
