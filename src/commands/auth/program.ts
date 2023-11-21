"use strict";
import Ora from "ora";
import fs from "fs";
import BaseCommand from "../baseCommand";
import { ORM } from "../../Types/CommandTypes";
const spinner = Ora("Processing: ");

class AuthProgram {
  static async handle(orm: ORM) {
    try {
      let status = await this.createAuthRoute();
      if (status) {
        await this.createModel(orm);
      } else {
        await BaseCommand.error("An Error Ocurred While Generating Authentication Routes.");
      }
    } catch (error) {
      await BaseCommand.error("An Error Ocurred While Generating Authentication: " + error);
    }
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
    let dir = "./Routes/AuthRoute";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    return await fs.promises
      .appendFile("./Routes/authRoute/index.ts", this.routeBody())
      .then(() => {
        spinner.color = "green";
        spinner.text = "Completed";
        spinner.succeed("Authentication route successfully generated in App/Routes/AuthRoute folder");
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
    import {Route} from "Elucidate/Route/RouteManager";
    
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

    export default Route.exec;`;
    return body;
  }

  private static async createModel(orm: ORM) {
    spinner.start();
    spinner.color = "magenta";
    spinner.text = "Generating Authentication";
    let checkFolder = BaseCommand.checkFolderExists("./App/Model");
    if (checkFolder) {
      let doesFileExist = await BaseCommand.checkFileExists("./App/Model/UserModel.ts");
      if (!doesFileExist) {
        switch (orm) {
          case ORM.Mongoose:
            await this.nextStep(this.MongoDBModelBody());
          case ORM.Objection:
            await this.nextStep(this.ObjectionModelBody());
          case ORM.TypeORM:
            await this.nextStep(this.TypeORMModelBody());
          default:
            spinner.color = "red";
            spinner.text = "failed";
            spinner.fail("");
            await BaseCommand.error("Invalid ORM Selected.");
        }
      } else {
        spinner.color = "red";
        spinner.text = "failed";
        spinner.fail("");
        await BaseCommand.error("UserModel.ts already exist.");
      }
    } else {
      spinner.color = "red";
      spinner.text = "failed";
      spinner.fail("");
      await BaseCommand.error("App/Model directory does not exist. Kindly create that and try again");
    }
  }

  private static async nextStep(generateModel: any) {
    fs.appendFile("./App/Model/UserModel.ts", generateModel, function (err) {
      if (err) {
        spinner.color = "red";
        spinner.text = "failed";
        spinner.fail("");
        BaseCommand.error(err.errno);
        return false;
      }
      spinner.color = "green";
      spinner.text = "Completed";
      spinner.succeed("User_model.ts class successfully generated in App/Model folder");
      return true;
    });
  }

  private static MongoDBModelBody() {
    let body = `"use strict";
    import { mongoose, Schema, Document, Types } from "Elucidate/Database/NoSQLModel";

    export interface UserInterface extends Document {
      id: Types.ObjectId;
      username: string;
      email: string;
      password: string;
    }
    
    const UserSchema: Schema = new Schema({
      id: Schema.Types.ObjectId,
      username: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
    });
    UserSchema.set("timestamps", true);
    const User = mongoose.model<UserInterface>("User", UserSchema);
    export default User;`;
    return body;
  }

  private static TypeORMModelBody() {
    let body = `"use strict";
    import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

    @Entity('users')
    class User {
      @PrimaryGeneratedColumn()
      id!: number;

      @Column({ type: "varchar" })
      username!: string;

      @Column({ type: "varchar" })
      email!: string;

      @Column({ type: "varchar" })
      password!: string;
    }
    export default User;`;
    return body;
  }

  private static ObjectionModelBody() {
    let body = `"use strict";
    import {Model} from "Elucidate/Database/Model";
    class User extends Model{
      // Model attributes
      id!: number;
      username!: string;
      email!: string;
      password!: string;
      
      // Table name
      static tableName = "users"
    }

    export default User;`;
    return body;
  }
}

export default AuthProgram;
