"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const shelljs_1 = __importDefault(require("shelljs"));
const fs_1 = __importDefault(require("fs"));
class DevelopementServerProgram {
    static async handle() {
        if (fs_1.default.existsSync("../../../../../../build")) {
            this.runDevServer();
        }
        else {
            this.buildFile();
            this.runDevServer();
        }
    }
    static runDevServer() {
        if (shelljs_1.default.exec("nodemon").code !== 0) {
            shelljs_1.default.echo("Error: Run development server command failed");
            shelljs_1.default.exit(1);
        }
    }
    static buildFile() {
        if (shelljs_1.default.exec("node maker run-build").code !== 0) {
            shelljs_1.default.echo("Error: Build project command failed");
            shelljs_1.default.exit(1);
        }
    }
}
exports.default = DevelopementServerProgram;
