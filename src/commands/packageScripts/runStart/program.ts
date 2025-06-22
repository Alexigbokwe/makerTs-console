import { exec } from "child_process";
import { promises as fs, existsSync } from "fs";
import path from "path";
import { BaseScript } from "../BaseScript";
import { projectDirectory } from "../../../RootDirectory";
import BaseCommand from "../../baseCommand";

class RunStartProgram extends BaseScript {
  static async handle() {
    this.checkAppEnvironment();
    await this.runProductionServer();
  }

  private static async runProductionServer() {
    const spinner = BaseCommand.progress();
    spinner.start("Starting production server...");

    let entryPoint: string | null = null;
    if (existsSync("./app.js")) {
      entryPoint = "./app.js";
    } else if (existsSync("./build/app.js")) {
      entryPoint = "./build/app.js";
    }

    if (!entryPoint) {
      spinner.fail("No valid app.js file found in root or build directory");
      return;
    }

    let directory = path.join(projectDirectory, "node_modules", "maker-console-ts", "lib", "src", "configModuleAliases.js");
    if (entryPoint.includes("build")) {
      directory = directory.replace("build/", "");
    }

    const command = `node -r module-alias/register -r ${directory} ${entryPoint}`;
    const startProcess = exec(command);

    startProcess.stdout?.on("data", (data) => {
      console.log(data);
      if (data.includes("started successfully")) {
        spinner.succeed("Production server started successfully.");
      }
    });

    startProcess.stderr?.on("data", (data) => {
      console.error(data);
      spinner.fail("Failed to start production server.");
    });
  }
}

export default RunStartProgram;
