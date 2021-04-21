import shell from "shelljs";
import fs from "fs";

class DevelopementServerProgram {
  static async handle() {
    if (fs.existsSync("../../../../../../build")) {
      this.runDevServer();
    } else {
      this.buildFile();
      this.runDevServer();
    }
  }

  private static runDevServer() {
    if (shell.exec("nodemon").code !== 0) {
      shell.echo("Error: Run development server command failed");
      shell.exit(1);
    }
  }

  private static buildFile() {
    if (shell.exec("node maker run-build").code !== 0) {
      shell.echo("Error: Build project command failed");
      shell.exit(1);
    }
  }
}

export default DevelopementServerProgram;
