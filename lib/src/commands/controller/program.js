"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const baseCommand_1 = __importDefault(require("../baseCommand"));
const path_1 = __importDefault(require("path"));
class ControllerProgram {
    static async handle(name, resource = null) {
        name = name[0].toUpperCase() + name.slice(1);
        let check = await baseCommand_1.default.checkFileExists("./App/Http/Controller/" + name + ".ts");
        if (check == false) {
            await this.createController(name, resource);
        }
        else {
            return baseCommand_1.default.error("Controller class already exists");
        }
    }
    static async createController(name, resource = null) {
        let directory = "./App/Http/Controller/" + name + ".ts";
        let dirPath = path_1.default.dirname(directory);
        if (!fs_1.default.existsSync(dirPath)) {
            fs_1.default.mkdirSync(dirPath, { recursive: true });
        }
        if (resource == "Controller Resource Methods") {
            fs_1.default.appendFile(directory, await this.controllerBodyWithResource(name), (err) => {
                if (err)
                    baseCommand_1.default.error(err);
                baseCommand_1.default.success(this.formatControllerName(name) + " class successfully generated in App/Http/Controller folder");
            });
        }
        else {
            fs_1.default.appendFile(directory, await this.controllerBody(name), (err) => {
                if (err)
                    baseCommand_1.default.error(err);
                baseCommand_1.default.success(this.formatControllerName(name) + " class successfully generated in App/Http/Controller folder");
            });
        }
    }
    static formatControllerName(name) {
        if (name.includes("/")) {
            let controllernamesplit = name.split("/");
            return controllernamesplit[controllernamesplit.length - 1];
        }
        else {
            return name;
        }
    }
    static async controllerBody(name) {
        let controllerName = this.formatControllerName(name);
        let body = `"use strict";
    import { Request, Response, NextFunction } from "Elucidate/HttpContext";
    import HttpResponse from "Elucidate/HttpContext/ResponseType";

    class ${controllerName}{
      //
    }

    export default ${controllerName};
    `;
        return body;
    }
    static async controllerBodyWithResource(name) {
        let controllerName = this.formatControllerName(name);
        let body = `"use strict";
      import { Request, Response, NextFunction } from "Elucidate/HttpContext";
      import HttpResponse from "Elucidate/HttpContext/ResponseType";

      class ` +
            controllerName +
            `{
          /**
           * Display a listing of the resource.
           * @method
           * @endpoint
           * @param Request
           * @return Response
           */
          index = async (req: Request, res: Response, next: NextFunction) =>{
            try{
              //
            }catch (error) {
              return next(error);
            }
          }

          /**
           * Store a newly created resource in storage.
           * @method
           * @endpoint
           * @param Request
           * @return Response
           */
          store = async (req: Request, res: Response, next: NextFunction) => {
            try{
              //
            }catch (error) {
              return next(error);
            }
          }

          /**
           * Display the specified resource.
           * @method
           * @endpoint
           * @param Request
           * @return Response
           */
          show = async (req: Request, res: Response, next: NextFunction) => {
            try{
              //
            }catch (error) {
              return next(error);
            }
          }

          /**
           * Update the specified resource in storage.
           * @method
           * @endpoint
           * @param Request
           * @return Response
           */
          update = async (req: Request, res: Response, next: NextFunction) => {
            try{
              //
            }catch (error) {
              return next(error);
            }
          }

          /**
           * Remove the specified resource from storage.
           * @method
           * @endpoint
           * @param Request
           * @return Response
           */
          destroy = async (req: Request, res: Response, next: NextFunction) => {
            try{
              //
            }catch (error) {
              return next(error);
            }
          }
        }

        export default ` +
            controllerName +
            `;
        `;
        return body;
    }
}
exports.default = ControllerProgram;
