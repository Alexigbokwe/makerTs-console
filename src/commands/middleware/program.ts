"use strict";
import fs from "fs";
import BaseCommand from "../baseCommand";

class MiddlewareProgram {
  static async handle(name: string) {
    name = name[0].toUpperCase() + name.slice(1);
    let checkFolder = BaseCommand.checkFolderExists("./App/Http/Middleware");
    if (checkFolder) {
      let doesFileExist = await BaseCommand.checkFileExists(
        "./App/Http/Middleware/" + name + "_middleware.ts",
      );
      if (doesFileExist == false) {
        await this.nextStep(name);
      } else {
        return BaseCommand.error(
          name +
            "_middleware.ts already exist. Modify middleware name and try again",
        );
      }
    }
  }

  private static async nextStep(name: string) {
    fs.appendFile(
      "./App/Http/Middleware/" + name + "_middleware.ts",
      this.generateMiddleware(name),
      function (err) {
        if (err) return BaseCommand.error(err.errno);
        BaseCommand.success(
          name +
            "_middleware.ts class successfully generated in App/Http/Middleware folder",
        );
        return true;
      },
    );
  }

  private static generateMiddleware(name: string) {
    let body = `"use strict";

        class ${name} {
          /**
           * Handle Middleware.
           * @param {Request} req
           * @param {Response} res
           * @param {Next} next
           */
          public async handle(req, res, next) {
            //UpStream
            await next();
            //DownStream
          }
        }

        export default ${name};`;
    return body;
  }
}

export default MiddlewareProgram;
