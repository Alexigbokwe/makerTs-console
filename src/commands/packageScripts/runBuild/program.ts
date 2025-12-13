import { spawn } from "child_process";
import { promises as fs } from "fs";
import path from "path";
import { projectDirectory } from "../../../RootDirectory";
import BaseCommand from "../../baseCommand";
import { BaseScript } from "../BaseScript";

let config = require(`${projectDirectory}/Config/App`).default;

class CompileProgramProgram extends BaseScript {
  static async handle() {
    this.checkAppEnvironment();
    await this.buildFile();
  }

  private static async buildFile() {
    const spinner = BaseCommand.progress();
    spinner.start("Building project...");

    const commands = [
      { cmd: "rimraf", args: ["./build"] },
      { cmd: "tsc", args: ["-p", "."] },
      { cmd: "node", args: ["-r", "tsconfig-paths/register", "-e", "''"] },
    ];

    try {
      for (const { cmd, args } of commands) {
        await this.runCommand(cmd, args, spinner);
      }

      spinner.succeed("Project built successfully.");

      const directories = config.static_directories;
      if (directories.length > 0) {
        spinner.start("Copying static directories...");
        await this.copyStaticDirectories(directories);
        spinner.succeed("Static directories copied successfully.");
      }
    } catch (error) {
      spinner.fail(`Build failed: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  private static runCommand(command: string, args: string[], spinner: any): Promise<void> {
    return new Promise((resolve, reject) => {
      const process = spawn(command, args, {
        stdio: "inherit", // Show output directly
        shell: false,
      });

      process.on("error", (error) => {
        reject(error);
      });

      process.on("exit", (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`${command} exited with code ${code}`));
        }
      });
    });
  }

  private static async copyStaticDirectories(directories: Array<{ name: string; source: string; destination: string }>) {
    for (const directory of directories) {
      const sourcePath = path.join(process.cwd(), directory.source);
      const destinationPath = path.join(process.cwd(), directory.destination);
      try {
        await fs.cp(sourcePath, destinationPath, { recursive: true });
      } catch (error) {
        console.error(`Copy failed for ${directory.name}: ${error}`);
      }
    }
  }
}

export default CompileProgramProgram;
