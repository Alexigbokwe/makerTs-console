"use strict";
import fs from "fs";
import BaseCommand from "../baseCommand";

class MiddlewareProgram {
  static async handle(name: string) {
    name = name[0].toUpperCase() + name.slice(1);
    let checkFolder = BaseCommand.checkFolderExists("./App/Http/Middleware");
    if (checkFolder) {
      let doesFileExist = await BaseCommand.checkFileExists("./App/Http/Middleware/" + name + "Middleware.ts");
      if (doesFileExist == false) {
        await this.nextStep(name);
      } else {
        return BaseCommand.error(name + "Middleware.ts already exist. Modify middleware name and try again");
      }
    }
  }

  private static async nextStep(name: string) {
    fs.appendFile("./App/Http/Middleware/" + name + "Middleware.ts", this.generateMiddleware(name), function (err) {
      if (err) return BaseCommand.error(err.errno);
      BaseCommand.success(name + "Middleware.ts class successfully generated in App/Http/Middleware folder");
      return true;
    });
  }

  private static generateMiddleware(name: string) {
    let body = `"use strict";
    import { Request, Response } from "Config/http";
    import { MiddlewareHandler } from "Elucidate/MiddlewareHandler";
    // import { HttpResponse } from "Elucidate/HttpContext";
    
    class ${name} extends MiddlewareHandler{
      override async preHandle(req: Request, res: Response): Promise<boolean> {
        return true;
      }
    }

    export default ${name};`;
    return body;
  }
}

export default MiddlewareProgram;
