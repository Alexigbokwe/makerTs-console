"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const baseCommand_1 = __importDefault(require("../baseCommand"));
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
        if (resource == "Controller Resource Methods") {
            fs_1.default.appendFile("./App/Http/Controller/" + name + ".ts", await this.controllerBodyWithResource(name), (err) => {
                if (err)
                    baseCommand_1.default.error(err);
                baseCommand_1.default.success(this.formatControllerName(name) + " class successfully generated in App/Http/Controller folder");
            });
        }
        else {
            fs_1.default.appendFile("./App/Http/Controller/" + name + ".ts", await this.controllerBody(name), (err) => {
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
           */
          index = async (req: Request, res: Response, next: NextFunction) =>{
            try{
              //
            }catch (error) {
              return next(error);
            }
          }

          /**
           * Show the form for creating a new resource.
           *
           * @return Response
           */
          create = async (req: Request, res: Response, next: NextFunction) => {
            try{
              //
            }catch (error) {
              return next(error);
            }
          }

          /**
           * Store a newly created resource in storage.
           * @param  Request 
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
           * @param  Request
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
           * Show the form for editing the specified resource.
           * @param  Request
           * @return Response
           */
          edit = async (req: Request, res: Response, next: NextFunction) => {
            try{
              //
            }catch (error) {
              return next(error);
            }
          }

          /**
           * Update the specified resource in storage.
           * @param  Request
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
           *
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
