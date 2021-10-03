"use strict";
import Ora from "ora";
import fs from "fs";
import BaseCommand from "../baseCommand";
import shell from "shelljs";
const spinner = Ora("Processing: ");

class RouteProgram {
  static async handle(name: string) {
    spinner.start();
    spinner.color = "magenta";
    spinner.text = "Generating Route";
    name = name[0].toUpperCase() + name.slice(1);
    let doesFileExist = await BaseCommand.checkFileExists(`./Routes/${name}/index.ts`);
    if (doesFileExist == false) {
      await this.nextStep(name);
      spinner.color = "green";
      spinner.text = "Completed";
      spinner.succeed("Completed 😊😘");
    } else {
      spinner.color = "red";
      spinner.text = "failed";
      spinner.fail("");
      return BaseCommand.error(name + " route folder already exist. Modify route name and try again");
    }
  }

  private static async nextStep(name: string) {
    await this.routeFolder(name);
    shell.mv("./output.txt", "./App/Providers/Route.ts");
  }

  private static async routeFolder(name: string) {
    shell.mkdir("./Routes/" + name);
    fs.appendFile("./Routes/" + name + "/index.ts", await this.routeBody(name), function (err: any) {
      if (err) throw err;
      BaseCommand.success(`${name} route successfully generated in Routes/${name}`);
    });
  }

  private static async routeBody(name: string) {
    let body = `"use strict";
    import Route from "Elucidate/Route/manager";
    //import { Request, Response, NextFunction } from "Elucidate/HttpContext";
       
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

export default RouteProgram;
