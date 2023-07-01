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
    let body = `
    import { Request, Response } from "Config/Http";
    import { BaseController } from "App/Http/Controller/BaseController";

    export class ${controllerName} extends BaseController{
      //
    }`;
    return body;
  }

  static async controllerBodyWithResource(name: string) {
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

export default ControllerProgram;
