"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const shelljs_1 = tslib_1.__importDefault(require("shelljs"));
class RunStartProgram {
    static async handle() {
        this.runProductionServer();
    }
    static runProductionServer() {
        if (shelljs_1.default.exec("tsc && node -r tsconfig-paths/register -r ts-node/register build/app.js").code !== 0) {
            shelljs_1.default.echo("Error: Run production server command failed");
            shelljs_1.default.exit(1);
        }
    }
}
exports.default = RunStartProgram;
