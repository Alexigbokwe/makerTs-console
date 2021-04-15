"use strict";
const pathTo = process.env.PWD;
import BaseCommand from "../baseCommand";

class ScheduledProgram {
  static async handle() {
    let path = `${pathTo}/App/Console/kernel.ts`;
    let kernel = require(path);
    try {
      BaseCommand.success("Running scheduled command");
      kernel.schedule();
    } catch (error) {
      BaseCommand.error(error);
    }
  }
}

export default ScheduledProgram;
