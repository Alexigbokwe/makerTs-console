import { exec } from "child_process";
import { promises as fs } from "fs";
import path from "path";
import { projectDirectory } from "../../../RootDirectory";
import { BaseScript } from "../BaseScript";
import BaseCommand from "../../baseCommand";

let config = require(`${projectDirectory}/Config/App`).default;

class CompileProgramProgram extends BaseScript {
  static async handle() {
    this.checkAppEnvironment();
    await this.buildFile();
  }

  private static async buildFile() {
    const spinner = BaseCommand.progress();
    spinner.start("Building project...");

    const command = "rimraf ./build && tsc -p . && node -r tsconfig-paths/register -e ''";
    exec(command, async (error) => {
      if (error) {
        spinner.fail(`Build failed: ${error.message}`);
        return;
      }
      spinner.succeed("Project built successfully.");

      const directories = config.static_directories;
      if (directories.length > 0) {
        spinner.start("Copying static directories...");
        await this.copyStaticDirectories(directories);
        spinner.succeed("Static directories copied successfully.");
      }
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
