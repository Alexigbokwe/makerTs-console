import * as dotenv from "dotenv";
dotenv.config();

export abstract class BaseScript {
  public static checkAppEnvironment() {
    if (process.env["NODE_ENV"] === "test") {
      throw new Error("App environment is current set to test. Update and try again");
    }
  }
}
