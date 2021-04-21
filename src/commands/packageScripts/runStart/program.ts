import shell from "shelljs";
import fs from "fs";

class RunStartProgram {
  static async handle() {
    this.runProductionServer();
  }

  private static runProductionServer() {
    if (shell.exec("tsc && node -r tsconfig-paths/register -r ts-node/register build/app.js").code !== 0) {
      shell.echo("Error: Run production server command failed");
      shell.exit(1);
    }
  }
}

export default RunStartProgram;
