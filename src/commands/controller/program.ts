"use strict";
import fs from "fs";
import BaseCommand from "../baseCommand";

class ControllerProgram {
  static async handle(name: string, resource = null) {
    name = name[0].toUpperCase() + name.slice(1);
    let check = await BaseCommand.checkFileExists("./App/Http/Controller/" + name + ".ts");
    if (check == false) {
      await this.createController(name, resource);
    } else {
      return BaseCommand.error("Controller class already exists");
    }
  }

  private static async createController(name: string, resource = null) {
    let controllerName = "";
    if (name.includes("/")) {
      let controllernamesplit = name.split("/");
      controllerName = controllernamesplit[controllernamesplit.length - 1];
    } else {
      controllerName = name;
    }
    if (resource == "Controller Resource Methods") {
      fs.appendFile("./App/Http/Controller/" + controllerName + ".ts", await this.controllerBodyWithResource(controllerName), function (err) {
        if (err) BaseCommand.error(err);
        BaseCommand.success(controllerName + " class successfully generated in App/Http/Controller folder");
      });
    } else {
      fs.appendFile("./App/Http/Controller/" + controllerName + ".ts", await this.controllerBody(controllerName), function (err) {
        if (err) BaseCommand.error(err);
        BaseCommand.success(controllerName + " class successfully generated in App/Http/Controller folder");
      });
    }
  }

  private static async controllerBody(controllerName: string) {
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

  private static async controllerBodyWithResource(controllerName: string) {
    let body =
      `"use strict";
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

export default ControllerProgram;
