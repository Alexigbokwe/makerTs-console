"use strict";
import Ora from "ora";
import fs from "fs";
import BaseCommand from "../baseCommand";
const spinner = Ora("Processing: ");

class AuthProgram {
  static async handle() {
    let status = await this.createAuthRoute();
    if (status != false) await this.createModel();
  }

  private static checkDatabaseDriver() {
    return process.env.DB_CONNECTION == "mongoose" ? "nosql" : "sql";
  }

  private static async createAuthRoute() {
    spinner.start();
    spinner.color = "magenta";
    spinner.text = "Generating Authentication route";
    let doesFileExist = await BaseCommand.checkFileExists("./Routes/authRoute/index.ts");
    if (doesFileExist == false) {
      return await this.appendRoute();
    } else {
      spinner.color = "red";
      spinner.text = "failed";
      spinner.fail("");
      await BaseCommand.error("Authentication routes already exist in App/Routes/authRoute folder.");
      return false;
    }
  }

  private static async appendRoute() {
    return fs.promises
      .appendFile("./Routes/authRoute/index.ts", this.routeBody())
      .then(() => {
        spinner.color = "green";
        spinner.text = "Completed";
        spinner.succeed("Completed 😊😘");
        BaseCommand.success("Authentication route successfully generated in App/Routes/authRoute folder");
        return true;
      })
      .catch((err) => {
        spinner.color = "red";
        spinner.text = "failed";
        spinner.fail("");
        BaseCommand.error(err.errno);
        return false;
      });
  }

  private static routeBody() {
    let body = `
    "use strict";
    import Route from "Elucidate/Route/manager";
    
    /*
    |--------------------------------------------------------------------------
    | Authentication Route File   
    |--------------------------------------------------------------------------
    |
    | This route handles both login and registration.
    | 
    */

    Route.post("/register", "Auth/RegisterController@register");

    Route.post("/login", "Auth/LoginController@login");

    module.exports = Route.exec;`;
    return body;
  }

  private static async createModel() {
    spinner.start();
    spinner.color = "magenta";
    spinner.text = "Generating Authentication";
    let checkFolder = BaseCommand.checkFolderExists("./App/Model");
    if (checkFolder) {
      let doesFileExist = await BaseCommand.checkFileExists("./App/Model/User_model.ts");
      if (doesFileExist == false) {
        this.checkDatabaseDriver() == "nosql" ? await this.nextStep(this.generateNoSqlModel()) : await this.nextStep(this.generateSqlModel());
      } else {
        spinner.color = "red";
        spinner.text = "failed";
        spinner.fail("");
        await BaseCommand.error("User_model.ts already exist.");
      }
    } else {
      spinner.color = "red";
      spinner.text = "failed";
      spinner.fail("");
      await BaseCommand.error("App/Model directory does not exist. Kindly create that and try again");
    }
  }

  private static async nextStep(generateModel: any) {
    fs.appendFile("./App/Model/User_model.ts", generateModel, function (err) {
      if (err) {
        spinner.color = "red";
        spinner.text = "failed";
        spinner.fail("");
        BaseCommand.error(err.errno);
        return false;
      }
      spinner.color = "green";
      spinner.text = "Completed";
      spinner.succeed("Completed 😊😘");
      BaseCommand.success("User_model.ts class successfully generated in App/Model folder");
      return true;
    });
  }

  private static generateNoSqlModel() {
    let body = `"use strict";
    import { mongoose, Schema, Document } from "Elucidate/Database/NoSQLModel";

    export interface UserInterface extends Document {
      username: string;
      email: string;
      password: string;
    }
    
    const UserSchema: Schema = new Schema({
      username: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
    });
    UserSchema.set("timestamps", true);
    const User = mongoose.model<UserInterface>("User", UserSchema);
    export default User;`;
    return body;
  }

  private static generateSqlModel() {
    let body = `"use strict";
    import { Model } from "Elucidate/Database/Model";

    class User extends Model {
      // Model attributes
      id!: number;
      username!: string;
      email!: string;
      password!: string;
    
      // Table name
      static tableName = "users";
    }
    
    export default User;`;
    return body;
  }
}

export default AuthProgram;
