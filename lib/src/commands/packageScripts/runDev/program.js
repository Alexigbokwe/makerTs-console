"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const shelljs_1 = tslib_1.__importDefault(require("shelljs"));
class DevelopementServerProgram {
    static async handle() {
        this.runDevServer();
    }
    static runDevServer() {
        if (shelljs_1.default.exec("nodemon").code !== 0) {
            shelljs_1.default.echo("Error: Run development server command failed");
            shelljs_1.default.exit(1);
        }
    }
}
exports.default = DevelopementServerProgram;
