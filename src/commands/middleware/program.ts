"use strict";
import { promises as fs } from "fs";
import BaseCommand from "../baseCommand";
import path from "path";

export class MiddlewareProgram {
  static async handle(name: string) {
    name = name[0].toUpperCase() + name.slice(1);
    const middlewareName = `${name}Middleware`;
    const middlewarePath = path.join("App", "Http", "Middleware");
    const filePath = path.join(middlewarePath, `${middlewareName}.ts`);

    if (await BaseCommand.checkFileExists(filePath)) {
      return BaseCommand.error(`${middlewareName}.ts already exists. Modify middleware name and try again`);
    }

    if (await BaseCommand.checkFolderExists(middlewarePath)) {
      await this.nextStep(middlewareName, filePath);
    }
  }

  private static async nextStep(middlewareName: string, filePath: string) {
    try {
      await fs.writeFile(filePath, this.generateMiddleware(middlewareName));
      BaseCommand.success(`${middlewareName}.ts class successfully generated in App/Http/Middleware folder`);
    } catch (err) {
      BaseCommand.error((err as Error).message);
    }
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
