"use strict";
import Ora from "ora";
import fs from "fs";
import BaseCommand from "../baseCommand";
const spinner = Ora("Processing: ");

class AuthProgram {
  static async handle() {
    let status = await this.createModel();
    if (status != false) await this.createAuthRoute();
  }

  private static checkDatabaseDriver() {
    return process.env.DB_CONNECTION == "mongoose" ? "nosql" : "sql";
  }

  private static async createAuthRoute() {
    spinner.start();
    spinner.color = "magenta";
    spinner.text = "Generating Authentication route";
    let checkFolder = BaseCommand.checkFolderExists("./Routes/authRoute");
    if (checkFolder) {
      let doesFileExist = await BaseCommand.checkFileExists("./Routes/authRoute/index.ts");
      if (doesFileExist == false) {
        await this.appendRoute();
      } else {
        spinner.color = "red";
        spinner.text = "failed";
        spinner.fail("");
        return await BaseCommand.error("Authentication routes already exist in App/Routes/authRoute folder.");
      }
    }
  }

  private static async appendRoute() {
    fs.appendFile("./Routes/authRoute/index.ts", this.routeBody(), function (err) {
      if (err) {
        spinner.color = "red";
        spinner.text = "failed";
        spinner.fail("");
        BaseCommand.error(err.errno);
        return false;
      } else {
        spinner.color = "green";
        spinner.text = "Completed";
        spinner.succeed("Completed 😊😘");
        BaseCommand.success("Authentication route successfully generated in App/Routes/authRoute folder");
        return true;
      }
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
        return this.checkDatabaseDriver() == "nosql" ? await this.nextStep(this.generateNoSqlModel()) : await this.nextStep(this.generateSqlModel());
      } else {
        spinner.color = "red";
        spinner.text = "failed";
        spinner.fail("");
        await BaseCommand.error("User_model.ts already exist.");
        return false;
      }
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
