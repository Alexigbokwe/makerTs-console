"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Ora_1 = __importDefault(require("Ora"));
const fs_1 = __importDefault(require("fs"));
const baseCommand_1 = __importDefault(require("../baseCommand"));
const spinner = Ora_1.default("Processing: ");
class AuthProgram {
    static async handle() {
        let status = await this.createModel();
        if (status != false)
            await this.createAuthRoute();
    }
    static checkDatabaseDriver() {
        return process.env.DB_CONNECTION == "mongoose" ? "nosql" : "sql";
    }
    static async createAuthRoute() {
        spinner.start();
        spinner.color = "magenta";
        spinner.text = "Generating Authentication route";
        let checkFolder = baseCommand_1.default.checkFolderExists("./Routes/authRoute");
        if (checkFolder) {
            let doesFileExist = await baseCommand_1.default.checkFileExists("./Routes/authRoute/index.ts");
            if (doesFileExist == false) {
                await this.appendRoute();
            }
            else {
                spinner.color = "red";
                spinner.text = "failed";
                spinner.fail("");
                return await baseCommand_1.default.error("Authentication routes already exist in App/Routes/authRoute folder.");
            }
        }
    }
    static async appendRoute() {
        fs_1.default.appendFile("./Routes/authRoute/index.ts", this.routeBody(), function (err) {
            if (err) {
                spinner.color = "red";
                spinner.text = "failed";
                spinner.fail("");
                baseCommand_1.default.error(err.errno);
                return false;
            }
            else {
                spinner.color = "green";
                spinner.text = "Completed";
                spinner.succeed("Completed 😊😘");
                baseCommand_1.default.success("Authentication route successfully generated in App/Routes/authRoute folder");
                return true;
            }
        });
    }
    static routeBody() {
        let body = `
    "use strict";
    const Route = require("@routerManager");
    
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
    
    export defaut Route.exec;
    `;
        return body;
    }
    static async createModel() {
        spinner.start();
        spinner.color = "magenta";
        spinner.text = "Generating Authentication";
        let checkFolder = baseCommand_1.default.checkFolderExists("./App/Model");
        if (checkFolder) {
            let doesFileExist = await baseCommand_1.default.checkFileExists("./App/Model/User_model.ts");
            if (doesFileExist == false) {
                return this.checkDatabaseDriver() == "nosql"
                    ? await this.nextStep(this.generateNoSqlModel())
                    : await this.nextStep(this.generateSqlModel());
            }
            else {
                spinner.color = "red";
                spinner.text = "failed";
                spinner.fail("");
                await baseCommand_1.default.error("User_model.ts already exist.");
                return false;
            }
        }
    }
    static async nextStep(generateModel) {
        fs_1.default.appendFile("./App/Model/User_model.ts", generateModel, function (err) {
            if (err) {
                spinner.color = "red";
                spinner.text = "failed";
                spinner.fail("");
                baseCommand_1.default.error(err.errno);
                return false;
            }
            spinner.color = "green";
            spinner.text = "Completed";
            spinner.succeed("Completed 😊😘");
            baseCommand_1.default.success("User_model.ts class successfully generated in App/Model folder");
            return true;
        });
    }
    static generateNoSqlModel() {
        let body = `"use strict";
    let mongoose = require("mongoose");
    let Schema = mongoose.Schema;
    let uniqueValidator = require("mongoose-unique-validator");

    let UserSchema = new Schema({
      //define the shape of your document within the collection.
      _id: mongoose.Schema.Types.ObjectId,
      first_name: { type: String, required: true },
      last_name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
    })

    UserSchema.set("timestamps", true);
    UserSchema.plugin(uniqueValidator);

    export default mongoose.model("User",UserSchema);
    `;
        return body;
    }
    static generateSqlModel() {
        let body = `"use strict";
    const Model = require("@elucidate/Model");

    class User extends Model {
      static get tableName() {
        return "users";
      }
    }
    
    export default User;`;
        return body;
    }
}
exports.default = AuthProgram;