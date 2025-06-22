"use strict";
import { promises as fs } from "fs";
import BaseCommand from "../baseCommand";
import path from "path";

export class RouteProgram {
  static async handle(name: string) {
    const spinner = BaseCommand.progress();
    spinner.start("Generating Route");
    name = name[0].toUpperCase() + name.slice(1);
    const routePath = path.join("Routes", name);
    const filePath = path.join(routePath, "index.ts");

    if (await BaseCommand.checkFileExists(filePath)) {
      spinner.fail();
      return BaseCommand.error(`${name} route folder already exists. Modify route name and try again`);
    }

    try {
      await this.nextStep(name, routePath, filePath);
      spinner.succeed(`Route [${name}] created successfully.`);
    } catch (error) {
      spinner.fail();
      BaseCommand.error(`Failed to create route: ${(error as Error).message}`);
    }
  }

  private static async nextStep(name: string, routePath: string, filePath: string) {
    await fs.mkdir(routePath, { recursive: true });
    const routeBodyContent = await this.routeBody(name);
    await fs.writeFile(filePath, routeBodyContent);
    BaseCommand.success(`${name} route successfully generated in ${routePath}`);
  }

  static async routeBody(name: string) {
    let body = `"use strict";
    import { Route } from "Elucidate/Route/RouteManager";
   //import { Request, Response } from "Config/Http";
       
    /*
    |--------------------------------------------------------------------------
    | ${name} Route File   
    |--------------------------------------------------------------------------
    | Example of closure route 
    | Route.get("/",(req:Request,res:Response)=>{}); 
    |
    | Example of controller route.
    | Route.get("/","UserController@index");
    | 
    */

    Route.group({prefix:'${name.toLowerCase()}'}, () => {
      //
    });
      

    //--------------------------------------------------------------------------
    export default Route.exec;
    `;
    return body;
  }
}
