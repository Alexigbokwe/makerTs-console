"use strict";
import fs from "fs/promises";
import BaseCommand from "../baseCommand";
import { Arguments } from "../../Types/CommandTypes";

class ControllerProgram {
  static async handle(name: string, directoryPath: string, resource?: Arguments.resourceController) {
    name = name[0].toUpperCase() + name.slice(1);
    const controllerPath = `${directoryPath}/${name}.ts`;
    const exists = await BaseCommand.checkFileExists(controllerPath);
    if (!exists) {
      await this.createController(name, directoryPath, controllerPath, resource);
    } else {
      BaseCommand.error(`Controller class ${name} already exists.`);
    }
  }

  private static async createController(name: string, directoryPath: string, controllerPath: string, resource?: Arguments.resourceController) {
    try {
      await BaseCommand.checkFolderExists(directoryPath);
      const body = resource === Arguments.resourceController ? await this.controllerBodyWithResource(name) : await this.controllerBody(name);
      await fs.writeFile(controllerPath, body);
      BaseCommand.success(`${this.formatControllerName(name)} class successfully generated in ${directoryPath} folder`);
    } catch (err) {
      BaseCommand.error(err);
    }
  }

  private static formatControllerName(name: string): string {
    if (name.includes("/")) {
      let controllerNameSplit = name.split("/");
      return controllerNameSplit[controllerNameSplit.length - 1];
    } else {
      return name;
    }
  }

  private static async controllerBody(name: string) {
    let controllerName = this.formatControllerName(name);
    let body = `
    import { HttpContext } from "Resources/platform";
    import { BaseController } from "App/Http/Controller/BaseController";

    export class ${controllerName} extends BaseController{
      //
    }`;
    return body;
  }

  static async controllerBodyWithResource(name: string) {
    let controllerName = this.formatControllerName(name);
    let body = `
    import { HttpContext } from "Resources/platform";
    import { BaseController } from "App/Http/Controller/BaseController";

    export class ${controllerName} extends BaseController{
        
      /**
       * Display a listing of the resource.
       * @method GET
       * @endpoint
       */
      public async index(ctx: HttpContext){
        throw new Error('${controllerName} index method not implemented.');
      }

      /**
       * Store a newly created resource in storage.
       * @method POST
       * @endpoint
       */
      public async store(ctx: HttpContext){
        throw new Error('${controllerName} store method not implemented.');
      }

      /**
       * Display the specified resource.
       * @method GET
       * @endpoint
       */
      public async show(ctx: HttpContext){
        throw new Error('${controllerName} show method not implemented.');
      }

      /**
       * Update the specified resource in storage.
       * @method PUT/PATCH
       * @endpoint
       */
      public async update(ctx: HttpContext){
        throw new Error('${controllerName} update method not implemented.');
      }

      /**
       * Remove the specified resource from storage.
       * @method DELETE
       * @endpoint
       */
      public async destroy(ctx: HttpContext){
        throw new Error('${controllerName} destroy method not implemented.');
      }
    }`;
    return body;
  }
}

export default ControllerProgram;
