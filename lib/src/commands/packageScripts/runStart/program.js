"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const shelljs_1 = __importDefault(require("shelljs"));
const BaseScript_1 = require("../BaseScript");
const fs_1 = __importDefault(require("fs"));
const RootDirectory_1 = require("src/RootDirectory");
class RunStartProgram extends BaseScript_1.BaseScript {
    static async handle() {
        this.checkAppEnvironment();
        this.runProductionServer();
    }
    static runProductionServer() {
        if (fs_1.default.existsSync("./app.js")) {
            if (shelljs_1.default.exec("node -r module-alias/register -r ./node_modules/maker-console-ts/lib/src/configModuleAliases.js ./app.js").code !== 0) {
                shelljs_1.default.echo("Error: Failed to start server using app.js");
                shelljs_1.default.exit(1);
            }
        }
        else if (fs_1.default.existsSync("./build/app.js")) {
            let directory = `${RootDirectory_1.projectDirectory}/node_modules/maker-console-ts/lib/src/configModuleAliases.js`;
            // remove build from directory
            directory = directory.replace("build/", "");
            if (shelljs_1.default.exec(`node -r module-alias/register -r ${directory} ./build/app.js`).code !== 0) {
                shelljs_1.default.echo("Error: Failed to start server using build/app.js");
                shelljs_1.default.exit(1);
            }
        }
        else {
            shelljs_1.default.echo("Error: No valid app.js file found in root or build directory");
            shelljs_1.default.exit(1);
        }
    }
}
exports.default = RunStartProgram;
