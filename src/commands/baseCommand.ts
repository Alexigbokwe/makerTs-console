"use strict";
import chalk from "chalk";
import fs from "fs";
import Ora from "ora";

class BaseCommand {
  static progress() {
    let spinner = Ora;
    return spinner;
  }
  static async error<T>(err: T): Promise<void> {
    console.log(chalk.red(`Error: ${err}`));
  }

  static async success<T>(message: T): Promise<void> {
    console.log(chalk.green(message));
  }

  static warning<T>(message: T): void {
    console.log(chalk.yellow(message));
  }

  static async checkFileExists(file: string): Promise<boolean> {
    return await fs.promises
      .access(file, fs.constants.F_OK)
      .then(() => true)
      .catch(() => false);
  }

  static checkFolderExists(name: string): boolean {
    fs.access(name, function (err) {
      if (err && err.code === "ENOENT") {
        fs.mkdir(name, (err) => {
          if (err) {
            BaseCommand.error(err);
            return false;
          }
        });
      }
    });
    return true;
  }
}

export default BaseCommand;
