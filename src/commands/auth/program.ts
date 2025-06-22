"use strict";
import path from "path";
import { promises as fs } from "fs";
import BaseCommand from "../baseCommand";
import { ORM } from "../../Types/CommandTypes";

class AuthProgram {
  static async handle(orm: ORM) {
    const spinner = BaseCommand.progress();
    spinner.start("Scaffolding authentication...");

    try {
      await Promise.all([this.generateAuthMiddleware(spinner), this.generateAuthControllers(spinner), this.generateAuthValidations(spinner), this.createAuthRoute(spinner), this.createModel(orm, spinner)]);

      spinner.succeed("Authentication scaffolding generated successfully.");
    } catch (error) {
      spinner.fail(`Authentication scaffolding failed: ${(error as Error).message}`);
    }
  }

  private static async generateAuthMiddleware(spinner: any) {
    spinner.text = "Generating authentication middleware...";
    const middlewarePath = path.join("App", "Http", "Middleware");
    await BaseCommand.checkFolderExists(middlewarePath);
    const filePath = path.join(middlewarePath, "Auth.ts");
    await fs.writeFile(filePath, this.authMiddleware());
  }

  private static authMiddleware() {
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

  private static async generateAuthControllers(spinner: any) {
    spinner.text = "Generating authentication controllers...";
    const controllerPath = path.join("App", "Http", "Controller", "Auth");
    await BaseCommand.checkFolderExists(controllerPath);

    await Promise.all([fs.writeFile(path.join(controllerPath, "LoginController.ts"), this.loginController()), fs.writeFile(path.join(controllerPath, "RegisterController.ts"), this.registerController())]);
  }

  private static loginController() {
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

  private static registerController() {
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

  private static async generateAuthValidations(spinner: any) {
    spinner.text = "Generating authentication validations...";
    const validationPath = path.join("App", "Http", "Validation");
    await BaseCommand.checkFolderExists(validationPath);

    await Promise.all([fs.writeFile(path.join(validationPath, "LoginValidation.ts"), this.loginValidation()), fs.writeFile(path.join(validationPath, "RegisterValidation.ts"), this.registrationValidation())]);
  }

  private static loginValidation() {
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

  private static registrationValidation() {
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

  private static async createAuthRoute(spinner: any) {
    spinner.text = "Creating authentication routes...";
    const routePath = path.join("Routes", "auth.ts");
    if (!(await BaseCommand.checkFileExists(routePath))) {
      await fs.writeFile(routePath, this.routeBody());
      await this.appendRoute();
    }
  }

  private static async appendRoute() {
    const mainRoutePath = path.join("Routes", "index.ts");
    const importStatement = `\nimport auth from "./auth";`;
    const useStatement = `\nRoute.use("/auth", auth);`;

    let mainRouteContent = await fs.readFile(mainRoutePath, "utf-8");
    if (!mainRouteContent.includes(importStatement)) {
      mainRouteContent += importStatement;
    }
    if (!mainRouteContent.includes(`Route.use("/auth", auth)`)) {
      mainRouteContent = mainRouteContent.replace("export default Route.exec;", `${useStatement}\nexport default Route.exec;`);
    }

    await fs.writeFile(mainRoutePath, mainRouteContent);
  }

  private static routeBody() {
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

  private static async createModel(orm: ORM, spinner: any) {
    spinner.text = "Creating user model...";
    const modelPath = path.join("App", "Model");
    await BaseCommand.checkFolderExists(modelPath);
    const filePath = path.join(modelPath, "User.ts");

    if (await BaseCommand.checkFileExists(filePath)) {
      BaseCommand.warning("User model already exists. Skipping creation.");
      return;
    }

    let modelBody;
    switch (orm) {
      case ORM.Mongoose:
        modelBody = this.MongoDBModelBody();
        break;
      case ORM.TypeORM:
        modelBody = this.TypeORMModelBody();
        break;
      case ORM.Objection:
        modelBody = this.ObjectionModelBody();
        break;
      default:
        throw new Error("Invalid ORM specified for auth scaffolding.");
    }
    await fs.writeFile(filePath, modelBody);
  }

  private static MongoDBModelBody() {
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

  private static TypeORMModelBody() {
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

  private static ObjectionModelBody() {
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

export default AuthProgram;
