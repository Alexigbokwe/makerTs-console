import shell from "shelljs";

class DevelopmentServerProgram {
  static async handle() {
    this.runDevServer();
  }

  private static runDevServer() {
    if (shell.exec('tsc-watch --onSuccess "node -r tsconfig-paths/register -r ts-node/register app.ts "').code !== 0) {
      shell.echo("Error: Run development server command failed");
      shell.exit(1);
    }
  }
}

export default DevelopmentServerProgram;
