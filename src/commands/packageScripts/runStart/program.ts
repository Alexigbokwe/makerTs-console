import { spawn } from "child_process";
import { existsSync } from "fs";
import path from "path";
import { projectDirectory } from "../../../RootDirectory";
import BaseCommand from "../../baseCommand";
import { BaseScript } from "../BaseScript";

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

    // Use spawn instead of exec - this doesn't create a shell subprocess
    const startProcess = spawn("node", ["-r", "module-alias/register", "-r", directory, entryPoint], {
      stdio: "inherit", // This passes through stdout/stderr directly
      detached: false, // Keep it attached to parent process
    });

    startProcess.on("error", (error) => {
      console.error(error);
      spinner.fail("Failed to start production server.");
    });

    startProcess.on("spawn", () => {
      spinner.succeed("Production server started successfully.");
    });
  }
}

export default RunStartProgram;
