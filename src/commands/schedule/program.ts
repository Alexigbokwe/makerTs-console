"use strict";
const pathTo = process.env.PWD;
import BaseCommand from "../baseCommand";
import shell from "shelljs";

class ScheduledProgram {
  static async handle() {
    if (shell.exec("tsc -p .").code !== 0) {
      shell.echo("Error: Build project command failed");
      shell.exit(1);
    } else {
      let path = `${pathTo}/build/App/Console/kernel.js`;
      let kernel = require(path);
      try {
        BaseCommand.success("Running scheduled command");
        kernel.schedule();
      } catch (error) {
        BaseCommand.error(error);
      }
    }
  }
}

export default ScheduledProgram;
