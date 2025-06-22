import { exec } from "child_process";
import { BaseScript } from "../BaseScript";

class DevelopmentServerProgram extends BaseScript {
  static async handle() {
    this.checkAppEnvironment();
    this.runDevServer();
  }

  private static runDevServer() {
    const command = 'tsc-watch --onSuccess "node -r tsconfig-paths/register -r ts-node/register app.ts "';
    const devProcess = exec(command);

    devProcess.stdout?.on("data", (data) => {
      console.log(data);
    });

    devProcess.stderr?.on("data", (data) => {
      console.error(data);
    });
  }
}

export default DevelopmentServerProgram;
