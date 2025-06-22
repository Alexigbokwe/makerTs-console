"use strict";
import chalk from "chalk";
import { promises as fs } from "fs";
import ora from "ora";

class BaseCommand {
  static progress() {
    return ora();
  }
  static error<T>(err: T): void {
    console.log(chalk.red(`Error: ${err}`));
  }

  static success<T>(message: T): void {
    console.log(chalk.green(message));
  }

  static warning<T>(message: T): void {
    console.log(chalk.yellow(message));
  }

  static async checkFileExists(file: string): Promise<boolean> {
    try {
      await fs.access(file);
      return true;
    } catch {
      return false;
    }
  }

  static async checkFolderExists(name: string): Promise<boolean> {
    try {
      await fs.access(name);
      return true;
    } catch {
      try {
        await fs.mkdir(name, { recursive: true });
        return true;
      } catch (err) {
        BaseCommand.error(err);
        return false;
      }
    }
  }
}

export default BaseCommand;
