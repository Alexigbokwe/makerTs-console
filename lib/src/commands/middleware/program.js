"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const baseCommand_1 = __importDefault(require("../baseCommand"));
class MiddlewareProgram {
    static async handle(name) {
        name = name[0].toUpperCase() + name.slice(1);
        let checkFolder = baseCommand_1.default.checkFolderExists("./App/Http/Middleware");
        if (checkFolder) {
            let doesFileExist = await baseCommand_1.default.checkFileExists("./App/Http/Middleware/" + name + "Middleware.ts");
            if (doesFileExist == false) {
                await this.nextStep(name);
            }
            else {
                return baseCommand_1.default.error(name + "Middleware.ts already exist. Modify middleware name and try again");
            }
        }
    }
    static async nextStep(name) {
        fs_1.default.appendFile("./App/Http/Middleware/" + name + "Middleware.ts", this.generateMiddleware(name), function (err) {
            if (err)
                return baseCommand_1.default.error(err.errno);
            baseCommand_1.default.success(name + "Middleware.ts class successfully generated in App/Http/Middleware folder");
            return true;
        });
    }
    static generateMiddleware(name) {
        let body = `"use strict";
    import { Request, Response } from "Config/http";
    import { MiddlewareHandler } from "Elucidate/MiddlewareHandler";
    
    class ${name} extends MiddlewareHandler{
      override async preHandle(req: Request, res: Response): Promise<boolean> {
        return true;
      }
    }

    export default ${name};`;
        return body;
    }
}
exports.default = MiddlewareProgram;
