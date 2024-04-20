"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ora_1 = __importDefault(require("ora"));
const fs_1 = __importDefault(require("fs"));
const baseCommand_1 = __importDefault(require("../baseCommand"));
const CommandTypes_1 = require("../../Types/CommandTypes");
const spinner = (0, ora_1.default)("Processing: ");
class AuthProgram {
    static async handle(orm) {
        try {
            const [routeStatus, validationCreated, controllerCreated, middlewareCreated] = await Promise.all([this.createAuthRoute(), this.generateAuthValidations(), this.generateAuthControllers(), this.generateAuthMiddleware()]);
            if (!routeStatus) {
                throw new Error("An error occurred while generating authentication routes.");
            }
            if (!validationCreated) {
                throw new Error("An error occurred while generating authentication validations.");
            }
            if (!controllerCreated) {
                throw new Error("An error occurred while generating authentication controllers.");
            }
            if (!middlewareCreated) {
                throw new Error("An error occurred while generating authentication middleware.");
            }
            await this.createModel(orm);
            baseCommand_1.default.success(" Authentication routes, validations, controllers, middleware and model successfully created.");
        }
        catch (error) {
            this.handleError(error);
        }
    }
    static handleError(error) {
        spinner.color = "red";
        spinner.text = "Failed";
        spinner.fail("");
        baseCommand_1.default.error("Error Occurred: " + error);
    }
    static async generateAuthMiddleware() {
        const dir = "./App/Http/Middleware";
        try {
            const dirExists = await fs_1.default.promises
                .stat(dir)
                .then((stats) => stats.isDirectory())
                .catch(() => false);
            // Create directory if it does not exist
            if (!dirExists) {
                await fs_1.default.promises.mkdir(dir, { recursive: true });
            }
            // Append file
            await fs_1.default.promises.appendFile(`${dir}/Auth.ts`, this.authMiddleware());
            // Success message
            spinner.color = "green";
            spinner.text = "Completed";
            spinner.succeed("Auth Middleware Successfully Generated in App/Http/Middleware folder");
            return true;
        }
        catch (err) {
            spinner.color = "red";
            spinner.text = "Failed";
            spinner.fail("");
            baseCommand_1.default.error(err);
            return false;
        }
    }
    static authMiddleware() {
        return `
     import { Authenticator } from "Elucidate/Auth/Authenticator";
     import { Request, Response } from "Config/Http";
     import { HttpResponse } from "Elucidate/HttpContext";
     import { MiddlewareHandler } from "Elucidate/MiddlewareHandler";
     import { Authority } from "Elucidate/AuthorizationFilter";
     
     export class AuthMiddleware extends MiddlewareHandler {
       constructor(private authenticator: Authenticator) {
         super();
       }
     
       override async preHandle(req: Request, res: Response): Promise<boolean> {
         let result = await this.authenticator.processAuthenticationMiddleware(req.headers["authorization"]);
     
         if (!result.status) {
           HttpResponse.UNAUTHORIZED(res, { auth: result.status, message: result.message, payload: result.payload });
           return false;
         }
     
         req.user = result.payload.user;
         Authority.setAuthenticatedUser(req.user as {} & { id: string | number });
         return true;
       }
     };
     `;
    }
    static async generateAuthControllers() {
        const dir = "./App/Http/Controller/Auth";
        try {
            const dirExists = await fs_1.default.promises
                .stat(dir)
                .then((stats) => stats.isDirectory())
                .catch(() => false);
            // Create directory if it does not exist
            if (!dirExists) {
                await fs_1.default.promises.mkdir(dir, { recursive: true });
            }
            // Append file
            await Promise.all([fs_1.default.promises.appendFile(`${dir}/LoginController.ts`, this.loginController()), fs_1.default.promises.appendFile(`${dir}/RegisterController.ts`, this.registerController())]);
            // Success message
            spinner.color = "green";
            spinner.text = "Completed";
            spinner.succeed("Login and Registration Controllers Successfully Generated in App/Http/Controller/Auth folder");
            return true;
        }
        catch (err) {
            spinner.color = "red";
            spinner.text = "Failed";
            spinner.fail("");
            baseCommand_1.default.error(err);
            return false;
        }
    }
    static loginController() {
        return `
    import type { Request, Response } from "Config/Http";
    import { Authenticator } from "Elucidate/Auth/Authenticator";
    import { LoginValidation, dataType } from "App/Http/Validation/LoginValidation";
    import { BaseController } from "../BaseController";
    
    export class LoginController extends BaseController {
      constructor(private readonly authenticator: Authenticator) {
        super();
      }
    
      /**
       * Authenticate user and sends the response with a generated token.
       */
      public async login(req: Request, res: Response) {
        const validation = await LoginValidation.validate<dataType>(req.body);
        if (!validation.success) {
          return this.response.UNAUTHORIZED(res, { data: validation, status: false });
        }
    
        const user = await this.authenticator.processLogin(validation.data);
        if (!user.status) {
          return this.response.BAD_REQUEST(res, {
            auth: user.status,
            message: user.message,
            error: user.payload,
          });
        }
    
        const token = this.authenticator.generateToken(user.payload);
        return this.response.OK(res, { data: { token }, status: true });
      }
    }
    `;
    }
    static registerController() {
        return `
    import type { Request, Response } from "Config/Http";
    import { Authenticator } from "Elucidate/Auth/Authenticator";
    import { dataType, RegisterValidation } from "App/Http/Validation/RegisterValidation";
    import { BaseController } from "../BaseController";
    
    export class RegisterController extends BaseController {
      constructor(private authenticator: Authenticator) {
        super();
      }
    
      // Handle user registration and token generation.
      public async register(req: Request, res: Response) {
        let validation = await RegisterValidation.validate<dataType>(req.body);
        if (validation.success) {
          validation.data.password = String(await this.authenticator.hashPassword(validation.data.password));
          let user = await this.authenticator.processRegistration(validation.data);
          if (user.status) {
            let token = this.authenticator.generateToken(user.payload);
            return this.response.OK(res, { status: true, data: { token } });
          }
          return this.response.UNAUTHORIZED(res, {
            auth: user.status,
            msg: user.message,
            error: user.payload,
          });
        } else {
          return this.response.BAD_REQUEST(res, { data: validation, status: false });
        }
      }
    }    
    `;
    }
    static async generateAuthValidations() {
        const dir = "./App/Http/Validation";
        try {
            const dirExists = await fs_1.default.promises
                .stat(dir)
                .then((stats) => stats.isDirectory())
                .catch(() => false);
            // Create directory if it does not exist
            if (!dirExists) {
                await fs_1.default.promises.mkdir(dir, { recursive: true });
            }
            // Append file
            await Promise.all([fs_1.default.promises.appendFile(`${dir}/LoginValidation.ts`, this.loginValidation()), fs_1.default.promises.appendFile(`${dir}/RegisterValidation.ts`, this.registrationValidation())]);
            // Success message
            spinner.color = "green";
            spinner.text = "Completed";
            spinner.succeed("Login and Registration Validation Successfully Generated in App/Http/Validation folder");
            return true;
        }
        catch (err) {
            // Error handling
            spinner.color = "red";
            spinner.text = "Failed";
            spinner.fail("");
            baseCommand_1.default.error(err);
            return false;
        }
    }
    static loginValidation() {
        return `
     import { FormRequest } from "Elucidate/Validator/FormRequest";

     type dataType = { email: string; password: string };
     
     class LoginValidation extends FormRequest {
       /**
        * Handle login request validation.
        * @param {*} data | e.g request body
        */
       static async validate<T>(data: any) {
         return await this.make<T>(data, {
           email: "required|email|max:255",
           password: "required|string|min:8",
         });
       }
     }
     
     export { LoginValidation, dataType };`;
    }
    static registrationValidation() {
        return `
    import { FormRequest } from "Elucidate/Validator/FormRequest";

    type dataType = { username: string; email: string; password: string };
    
    class RegisterValidation extends FormRequest {
      /**
       * Handle registration request validation.
       * @param {*} data | e.g request body
       */
      static async validate<T>(data: any) {
        return await this.make<T>(data, {
          username: "required|string|max:255",
          email: "required|string|email|max:255",
          password: "required|string|min:8",
        });
      }
    }
    
    export { RegisterValidation, dataType };`;
    }
    static async createAuthRoute() {
        spinner.start();
        spinner.color = "magenta";
        spinner.text = "Generating Authentication route";
        const fileExist = await baseCommand_1.default.checkFileExists("./Routes/AuthRoute/index.ts");
        if (!fileExist) {
            return await this.appendRoute();
        }
        else {
            spinner.color = "red";
            spinner.text = "failed";
            spinner.fail("");
            await baseCommand_1.default.error("Authentication routes already exist in App/Routes/AuthRoute folder.");
            return false;
        }
    }
    static async appendRoute() {
        const dir = "./Routes/AuthRoute";
        try {
            // Check if directory exists
            const dirExists = await fs_1.default.promises
                .stat(dir)
                .then((stats) => stats.isDirectory())
                .catch(() => false);
            // Create directory if it does not exist
            if (!dirExists) {
                await fs_1.default.promises.mkdir(dir, { recursive: true });
            }
            // Append file
            await fs_1.default.promises.appendFile(`${dir}/index.ts`, this.routeBody());
            // Success message
            spinner.color = "green";
            spinner.text = "Completed";
            spinner.succeed("Authentication route successfully generated in App/Routes/AuthRoute folder");
            return true;
        }
        catch (err) {
            // Error handling
            spinner.color = "red";
            spinner.text = "Failed";
            spinner.fail("");
            baseCommand_1.default.error(err);
            return false;
        }
    }
    static routeBody() {
        return `
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
                    case CommandTypes_1.ORM.Mongoose:
                        await this.nextStep(this.MongoDBModelBody());
                        break;
                    case CommandTypes_1.ORM.Objection:
                        await this.nextStep(this.ObjectionModelBody());
                        break;
                    case CommandTypes_1.ORM.TypeORM:
                        await this.nextStep(this.TypeORMModelBody());
                        break;
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
            spinner.succeed("UserModel class successfully generated in App/Model folder");
            return true;
        });
    }
    static MongoDBModelBody() {
        return `
    import mongoose,{Schema,Document, Types } from "mongoose";

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
    export const User = mongoose.model<UserInterface>("User", UserSchema);`;
    }
    static TypeORMModelBody() {
        return `
    import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

    @Entity('users')
    export class User {
      @PrimaryGeneratedColumn()
      id!: number;

      @Column({ type: "varchar" })
      username!: string;

      @Column({ type: "varchar" })
      email!: string;

      @Column({ type: "varchar" })
      password!: string;

      @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP(6)" })
      created_at?: Date;
    
      @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
      updated_at?: Date;
    }`;
    }
    static ObjectionModelBody() {
        return `"use strict";
    import {Model} from "Elucidate/Database/Model";
    export class User extends Model{
      // Model attributes
      id!: number;
      username!: string;
      email!: string;
      password!: string;
      created_at?: Date;
      updated_at?: Date;
      
      // Table name
      static tableName = "users"
    }`;
    }
}
exports.default = AuthProgram;
