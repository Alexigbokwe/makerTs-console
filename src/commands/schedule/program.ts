"use strict";
import path from "path";
import BaseCommand from "../baseCommand";

export class ScheduledProgram {
  static async handle() {
    const spinner = BaseCommand.progress();
    spinner.start("Running scheduled commands...");
    const kernelPath = path.join(process.cwd(), "App", "Console", "kernel.ts");

    try {
      const { default: kernel } = await import(kernelPath);
      await kernel.schedule();
      spinner.succeed("Scheduled commands executed successfully.");
    } catch (error) {
      spinner.fail(`Failed to run scheduled commands: ${(error as Error).message}`);
    }
  }
}
