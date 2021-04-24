"use strict";
const pathTo = process.env.PWD;
import BaseCommand from "../baseCommand";

class ScheduledProgram {
  static async handle() {
    let path = `${pathTo}/App/Console/kernel.ts`;
    await import(path).then((kernel) => {
      try {
        BaseCommand.success("Running scheduled command");
        kernel.default.schedule();
      } catch (error) {
        BaseCommand.error(error);
      }
    });
  }
}

export default ScheduledProgram;
