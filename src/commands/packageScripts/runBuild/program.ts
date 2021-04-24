import shell from "shelljs";
class CompileProgramProgram {
  static handle() {
    this.buildFile();
  }

  private static buildFile() {
    if (shell.exec("rimraf ./build && tsc -p .").code !== 0) {
      shell.echo("Error: Build project command failed");
      shell.exit(1);
    }
  }
}

export default CompileProgramProgram;
