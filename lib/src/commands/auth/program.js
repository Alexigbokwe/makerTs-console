"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ora_1 = __importDefault(require("ora"));
const fs_1 = __importDefault(require("fs"));
const baseCommand_1 = __importDefault(require("../baseCommand"));
const index_1 = require("../../index");
const spinner = (0, ora_1.default)("Processing: ");
class AuthProgram {
    static async handle(orm) {
        try {
            let status = await this.createAuthRoute();
            if (status) {
                await this.createModel(orm);
            }
            else {
                await baseCommand_1.default.error("An Error Ocurred While Generating Authentication Routes.");
            }
        }
        catch (error) {
            await baseCommand_1.default.error("An Error Ocurred While Generating Authentication: " + error);
        }
    }
    static checkDatabaseDriver() {
        return process.env.DB_CONNECTION == "mongoose" ? "nosql" : "sql";
    }
    static async createAuthRoute() {
        spinner.start();
        spinner.color = "magenta";
        spinner.text = "Generating Authentication route";
        let doesFileExist = await baseCommand_1.default.checkFileExists("./Routes/authRoute/index.ts");
        if (doesFileExist == false) {
            return await this.appendRoute();
        }
        else {
            spinner.color = "red";
            spinner.text = "failed";
            spinner.fail("");
            await baseCommand_1.default.error("Authentication routes already exist in App/Routes/authRoute folder.");
            return false;
        }
    }
    static async appendRoute() {
        let dir = "./Routes/AuthRoute";
        if (!fs_1.default.existsSync(dir)) {
            fs_1.default.mkdirSync(dir);
        }
        return await fs_1.default.promises
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
            baseCommand_1.default.error(err.errno);
            return false;
        });
    }
    static routeBody() {
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
    static async createModel(orm) {
        spinner.start();
        spinner.color = "magenta";
        spinner.text = "Generating Authentication";
        let checkFolder = baseCommand_1.default.checkFolderExists("./App/Model");
        if (checkFolder) {
            let doesFileExist = await baseCommand_1.default.checkFileExists("./App/Model/UserModel.ts");
            if (!doesFileExist) {
                switch (orm) {
                    case index_1.ORM.Mongoose:
                        await this.nextStep(this.MongoDBModelBody());
                    case index_1.ORM.Objection:
                        await this.nextStep(this.ObjectionModelBody());
                    case index_1.ORM.TypeORM:
                        await this.nextStep(this.TypeORMModelBody());
                    default:
                        spinner.color = "red";
                        spinner.text = "failed";
                        spinner.fail("");
                        await baseCommand_1.default.error("Invalid ORM Selected.");
                }
            }
            else {
                spinner.color = "red";
                spinner.text = "failed";
                spinner.fail("");
                await baseCommand_1.default.error("UserModel.ts already exist.");
            }
        }
        else {
            spinner.color = "red";
            spinner.text = "failed";
            spinner.fail("");
            await baseCommand_1.default.error("App/Model directory does not exist. Kindly create that and try again");
        }
    }
    static async nextStep(generateModel) {
        fs_1.default.appendFile("./App/Model/UserModel.ts", generateModel, function (err) {
            if (err) {
                spinner.color = "red";
                spinner.text = "failed";
                spinner.fail("");
                baseCommand_1.default.error(err.errno);
                return false;
            }
            spinner.color = "green";
            spinner.text = "Completed";
            spinner.succeed("User_model.ts class successfully generated in App/Model folder");
            return true;
        });
    }
    static MongoDBModelBody() {
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
    static TypeORMModelBody() {
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
    static ObjectionModelBody() {
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
exports.default = AuthProgram;
