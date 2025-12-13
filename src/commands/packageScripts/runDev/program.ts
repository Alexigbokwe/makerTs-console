import { spawn } from "child_process";
import { BaseScript } from "../BaseScript";

class DevelopmentServerProgram extends BaseScript {
  static async handle() {
    this.checkAppEnvironment();
    this.runDevServer();
  }

  private static runDevServer() {
    // Spawn tsc-watch with a custom onSuccess handler
    const devProcess = spawn("tsc-watch", ["--onSuccess", "node --require tsconfig-paths/register --require ts-node/register app.ts"], {
      stdio: "inherit",
      shell: false,
    });

    devProcess.on("error", (error) => {
      console.error("Failed to start dev server:", error);
      process.exit(1);
    });

    devProcess.on("exit", (code) => {
      console.log(`Dev server exited with code ${code}`);
      process.exit(code || 0);
    });

    // Handle process termination gracefully
    process.on("SIGINT", () => {
      devProcess.kill("SIGINT");
    });

    process.on("SIGTERM", () => {
      devProcess.kill("SIGTERM");
    });
  }
}

export default DevelopmentServerProgram;
