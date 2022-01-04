import shell from "shelljs";

class RunProductionProgram {
  static async handle() {
    this.runProductionServer();
  }

  private static runProductionServer() {
    if (shell.exec("node -r tsconfig-paths/register -r ts-node/register build/app.js").code !== 0) {
      shell.echo("Error: Run production server command failed");
      shell.exit(1);
    }
  }
}

export default RunProductionProgram;
