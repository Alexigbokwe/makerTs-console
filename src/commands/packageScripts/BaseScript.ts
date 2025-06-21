import * as dotenv from "dotenv";
dotenv.config();

export abstract class BaseScript {
  static currentEnvironment = process.env["APP_ENV"] || process.env["NODE_ENV"];
  public static checkAppEnvironment() {
    if (this.currentEnvironment === "test") {
      throw new Error("App environment is current set to test. Update and try again");
    }
  }
}
