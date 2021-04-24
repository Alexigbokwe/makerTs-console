"use strict";
const pathTo = process.env.PWD;
import BaseCommand from "../baseCommand";
import shell from "shelljs";

class ScheduledProgram {
  static async handle() {
    this.buildFile()
    let path = `${pathTo}/buildApp/Console/kernel.js`;
    let kernel = require(path);
    try {
      BaseCommand.success("Running scheduled command");
      kernel.schedule();
    } catch (error) {
      BaseCommand.error(error);
    }
  }

  private static buildFile() {
    if (shell.exec("tsc -p .").code !== 0) {
      shell.echo("Error: Build project command failed");
      shell.exit(1);
    }
  }
}

export default ScheduledProgram;
