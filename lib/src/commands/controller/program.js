"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const baseCommand_1 = __importDefault(require("../baseCommand"));
const path_1 = __importDefault(require("path"));
const CommandTypes_1 = require("../../Types/CommandTypes");
class ControllerProgram {
    static async handle(name, directoryPath, resource) {
        name = name[0].toUpperCase() + name.slice(1);
        let check = await baseCommand_1.default.checkFileExists("./" + directoryPath + "/" + name + ".ts");
        if (!check) {
            await this.createController(name, directoryPath, resource);
        }
        else {
            return baseCommand_1.default.error("Controller class already exists");
        }
    }
    static async createController(name, directoryPath, resource) {
        let directory = "./" + directoryPath + "/" + name + ".ts";
        let dirPath = path_1.default.dirname(directory);
        if (!fs_1.default.existsSync(dirPath)) {
            fs_1.default.mkdirSync(dirPath, { recursive: true });
        }
        if (resource === CommandTypes_1.Arguments.resourceController) {
            fs_1.default.appendFile(directory, await this.controllerBodyWithResource(name), (err) => {
                if (err)
                    baseCommand_1.default.error(err);
                baseCommand_1.default.success(this.formatControllerName(name) + " class successfully generated in " + directoryPath + " folder");
            });
        }
        else {
            fs_1.default.appendFile(directory, await this.controllerBody(name), (err) => {
                if (err)
                    baseCommand_1.default.error(err);
                baseCommand_1.default.success(this.formatControllerName(name) + " class successfully generated in " + directoryPath + " folder");
            });
        }
    }
    static formatControllerName(name) {
        if (name.includes("/")) {
            let controllerNameSplit = name.split("/");
            return controllerNameSplit[controllerNameSplit.length - 1];
        }
        else {
            return name;
        }
    }
    static async controllerBody(name) {
        let controllerName = this.formatControllerName(name);
        let body = `
    import { Request, Response } from "Config/Http";
    import { BaseController } from "App/Http/Controller/BaseController";

    export class ${controllerName} extends BaseController{
      //
    }`;
        return body;
    }
    static async controllerBodyWithResource(name) {
        let controllerName = this.formatControllerName(name);
        let body = `import { Request, Response } from "Config/Http";
    import { BaseController } from "App/Http/Controller/BaseController";

    export class ${controllerName} extends BaseController{
        
      /**
       * Display a listing of the resource.
       * @method GET
       * @endpoint
       */
      public async index(req: Request, res: Response){
        throw new Error('${controllerName} index method not implemented.');
      }

      /**
       * Store a newly created resource in storage.
       * @method POST
       * @endpoint
       */
      public async store(req: Request, res: Response){
        throw new Error('${controllerName} store method not implemented.');
      }

      /**
       * Display the specified resource.
       * @method GET
       * @endpoint
       */
      public async show(req: Request, res: Response){
        throw new Error('${controllerName} show method not implemented.');
      }

      /**
       * Update the specified resource in storage.
       * @method PUT/PATCH
       * @endpoint
       */
      public async update(req: Request, res: Response){
        throw new Error('${controllerName} update method not implemented.');
      }

      /**
       * Remove the specified resource from storage.
       * @method DELETE
       * @endpoint
       */
      public async destroy(req: Request, res: Response){
        throw new Error('${controllerName} destroy method not implemented.');
      }
    }`;
        return body;
    }
}
exports.default = ControllerProgram;
