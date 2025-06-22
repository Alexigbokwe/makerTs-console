"use strict";
import { promises as fs } from "fs";
import BaseCommand from "../baseCommand";
import path from "path";

export class JobProgram {
  static async handle(name: string) {
    const spinner = BaseCommand.progress();
    name = name[0].toUpperCase() + name.slice(1);
    const jobName = `${name}_job`;
    const jobPath = path.join("App", "Jobs");
    const filePath = path.join(jobPath, `${jobName}.ts`);

    spinner.start(`Generating job ${jobName}`);

    try {
      if (await BaseCommand.checkFileExists(filePath)) {
        throw new Error(`${jobName}.ts already exists. Modify job name and try again`);
      }

      await BaseCommand.checkFolderExists(jobPath);
      await this.nextStep(jobName, filePath, name);
      spinner.succeed(`Job ${jobName} created successfully.`);
    } catch (error) {
      spinner.fail((error as Error).message);
    }
  }

  private static async nextStep(jobName: string, filePath: string, name: string) {
    await fs.writeFile(filePath, this.generateJob(name));
    BaseCommand.success(`${jobName}.ts class successfully generated in App/Jobs folder`);
  }

  private static generateJob(name: string) {
    let body = `
    import ShouldQueue from "expresswebcorets/lib/Queue/ShouldQueue";

    export class ${name} extends ShouldQueue{
      constructor() {
        super("${name}");
      }
      
      /**
       * Handle method executes job.
       * @return void
       */
      handle<T>(data:T): void {
        //
      }
    }`;
    return body;
  }
}
