import shell from "shelljs";
import fs from "fs";

class CompileProgramProgram {
  static async handle() {
    this.buildFile();
  }

  private static buildFile() {
    if (shell.exec("rimraf ./build && npm run compile").code !== 0) {
      shell.echo("Error: Build project command failed");
      shell.exit(1);
    }
  }
}

export default CompileProgramProgram;
