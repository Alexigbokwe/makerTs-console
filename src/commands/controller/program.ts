"use strict";
import fs from "fs";
import BaseCommand from "../baseCommand";
import path from "path";

class ControllerProgram {
  static async handle(name: string, resource = null, directoryPath = "App/Http/Controller") {
    name = name[0].toUpperCase() + name.slice(1);
    let check = await BaseCommand.checkFileExists("./" + directoryPath + "/" + name + ".ts");
    if (check == false) {
      await this.createController(name, resource, directoryPath);
    } else {
      return BaseCommand.error("Controller class already exists");
    }
  }

  private static async createController(name: string, resource = null, directoryPath: string) {
    let directory = "./" + directoryPath + "/" + name + ".ts";
    let dirPath = path.dirname(directory);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    if (resource == "Controller Resource Methods") {
      fs.appendFile(directory, await this.controllerBodyWithResource(name), (err) => {
        if (err) BaseCommand.error(err);
        BaseCommand.success(this.formatControllerName(name) + " class successfully generated in " + directoryPath + " folder");
      });
    } else {
      fs.appendFile(directory, await this.controllerBody(name), (err) => {
        if (err) BaseCommand.error(err);
        BaseCommand.success(this.formatControllerName(name) + " class successfully generated in " + directoryPath + " folder");
      });
    }
  }

  private static formatControllerName(name: string): string {
    if (name.includes("/")) {
      let controllernamesplit = name.split("/");
      return controllernamesplit[controllernamesplit.length - 1];
    } else {
      return name;
    }
  }

  private static async controllerBody(name: string) {
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

  static async controllerBodyWithResource(name: string) {
    let controllerName = this.formatControllerName(name);
    let body =
      `"use strict";
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
          index = async (req: Request, res: Response): Promise<Response> =>{
            throw new Error('${controllerName} index method not implemented.');
          }

          /**
           * Store a newly created resource in storage.
           * @method
           * @endpoint
           * @param Request
           * @return Response
           */
          store = async (req: Request, res: Response): Promise<Response> => {
            throw new Error('${controllerName} store method not implemented.');
          }

          /**
           * Display the specified resource.
           * @method
           * @endpoint
           * @param Request
           * @return Response
           */
          show = async (req: Request, res: Response): Promise<Response> => {
            throw new Error('${controllerName} show method not implemented.');
          }

          /**
           * Update the specified resource in storage.
           * @method
           * @endpoint
           * @param Request
           * @return Response
           */
          update = async (req: Request, res: Response): Promise<Response> => {
            throw new Error('${controllerName} update method not implemented.');
          }

          /**
           * Remove the specified resource from storage.
           * @method
           * @endpoint
           * @param Request
           * @return Response
           */
          destroy = async (req: Request, res: Response): Promise<Response> => {
            throw new Error('${controllerName} destroy method not implemented.');
          }
        }

        export default ` +
      controllerName +
      `;
        `;
    return body;
  }
}

export default ControllerProgram;
