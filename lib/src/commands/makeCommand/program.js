"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleProgram = void 0;
const fs_1 = __importDefault(require("fs"));
const baseCommand_1 = __importDefault(require("../baseCommand"));
const config_1 = __importDefault(require("../../config"));
class ConsoleProgram {
    static async handle(name) {
        name = name[0].toUpperCase() + name.slice(1);
        this.doesCommandNameAlreadyExist(name);
        let checkFolder = baseCommand_1.default.checkFolderExists("./App/Console/Commands");
        if (checkFolder) {
            let doesFileExist = await baseCommand_1.default.checkFileExists("./App/Console/Commands/" + name + ".ts");
            if (!doesFileExist) {
                await this.nextStep(name);
            }
            else {
                return baseCommand_1.default.error(name + ".ts already exist. Modify command name and try again");
            }
        }
    }
    static doesCommandNameAlreadyExist(name) {
        if (config_1.default.has(name)) {
            throw new Error(`${name} commend already exist. Modify command name and try again`);
        }
    }
    static async nextStep(name) {
        fs_1.default.appendFile("./App/Console/Commands/" + name + ".ts", this.generateCommand(name), function (err) {
            if (err)
                return baseCommand_1.default.error(err.errno);
            baseCommand_1.default.success(name + ".ts class successfully generated in App/Console/Commands folder");
            return true;
        });
    }
    static generateCommand(name) {
        let body = `
    import {Command, CommandArgument} from "maker-console-ts";

    export class ${name} extends Command {
      /**
       * The name or signature of the console command.
      */
      public signature = "";

      /**
       * Argument name and mode of the console command.
       * name is the name of the argument while mode can be REQUIRED or OPTIONAL
       * Example [{name: "Debug", mode: "REQUIRED"},{name: "Task", mode: "REQUIRED"}]
       */
      public arguments?: CommandArgument = [];

      /**
       * The console command description.
       */
      public description = "";
    
      /**
       * Execute the console command.
       */
      public fire<T>(data?: T): void {
        //
      }
    }`;
        return body;
    }
}
exports.ConsoleProgram = ConsoleProgram;
