"use strict";
import { promises as fs } from "fs";
import BaseCommand from "../baseCommand";
import path from "path";

export class ListenerProgram {
  static async handle(name: string) {
    const spinner = BaseCommand.progress();
    name = name[0].toUpperCase() + name.slice(1);
    const listenerName = `${name}_listener`;
    const listenerPath = path.join("App", "Listeners");
    const filePath = path.join(listenerPath, `${listenerName}.ts`);

    spinner.start(`Generating listener ${listenerName}`);

    try {
      if (await BaseCommand.checkFileExists(filePath)) {
        throw new Error(`${listenerName}.ts already exists. Modify listener name and try again`);
      }

      await BaseCommand.checkFolderExists(listenerPath);
      await this.nextStep(listenerName, filePath, name);
      spinner.succeed(`Listener ${listenerName} created successfully.`);
    } catch (error) {
      spinner.fail((error as Error).message);
    }
  }

  private static async nextStep(listenerName: string, filePath: string, name: string) {
    await fs.writeFile(filePath, this.generateListener(name));
    BaseCommand.success(`${listenerName}.ts class successfully generated in App/Listeners folder`);
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
