"use strict";
import { promises as fs } from "fs";
import BaseCommand from "../baseCommand";
import path from "path";

export class EventProgram {
  static async handle(name: string) {
    const spinner = BaseCommand.progress();
    name = name[0].toUpperCase() + name.slice(1);
    const eventName = `${name}_event`;
    const eventPath = path.join("App", "Events");
    const filePath = path.join(eventPath, `${eventName}.ts`);

    spinner.start(`Generating event ${eventName}`);

    try {
      if (await BaseCommand.checkFileExists(filePath)) {
        throw new Error(`${eventName}.ts already exists. Modify event name and try again`);
      }

      await BaseCommand.checkFolderExists(eventPath);
      await this.nextStep(eventName, filePath, name);
      spinner.succeed(`Event ${eventName} created successfully.`);
    } catch (error) {
      spinner.fail((error as Error).message);
    }
  }

  private static async nextStep(eventName: string, filePath: string, name: string) {
    await fs.writeFile(filePath, this.generateEvent(name));
    BaseCommand.success(`${eventName}.ts class successfully generated in App/Events folder`);
  }

  private static generateEvent(name: string) {
    const body = `
    import Emitter from "Elucidate/Emitter";

    class ${name}<T> {
    
      constructor(private params:T) {
        this.listenOn();
        Emitter.emitEvent("${name}");
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
