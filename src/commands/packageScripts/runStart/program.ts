import shell from "shelljs";
import { BaseScript } from "../BaseScript";
import fs from "fs";
import { projectDirectory } from "../../../RootDirectory";

class RunStartProgram extends BaseScript {
  static async handle() {
    this.checkAppEnvironment();
    this.runProductionServer();
  }

  private static runProductionServer() {
    if (fs.existsSync("./app.js")) {
      if (shell.exec("node -r module-alias/register -r ./node_modules/maker-console-ts/lib/src/configModuleAliases.js ./app.js").code !== 0) {
        shell.echo("Error: Failed to start server using app.js");
        shell.exit(1);
      }
    } else if (fs.existsSync("./build/app.js")) {
      let directory = `${projectDirectory}/node_modules/maker-console-ts/lib/src/configModuleAliases.js`;
      // remove build from directory
      directory = directory.replace("build/", "");

      if (shell.exec(`node -r module-alias/register -r ${directory} ./build/app.js`).code !== 0) {
        shell.echo("Error: Failed to start server using build/app.js");
        shell.exit(1);
      }
    } else {
      shell.echo("Error: No valid app.js file found in root or build directory");
      shell.exit(1);
    }
  }
}

export default RunStartProgram;
