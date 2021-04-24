"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const pathTo = process.env.PWD;
const baseCommand_1 = tslib_1.__importDefault(require("../baseCommand"));
const shelljs_1 = tslib_1.__importDefault(require("shelljs"));
class ScheduledProgram {
    static async handle() {
        this.buildFile();
        let path = `${pathTo}/build/App/Console/kernel.js`;
        let kernel = require(path);
        try {
            baseCommand_1.default.success("Running scheduled command");
            kernel.schedule();
        }
        catch (error) {
            baseCommand_1.default.error(error);
        }
    }
    static buildFile() {
        if (shelljs_1.default.exec("tsc -p .").code !== 0) {
            shelljs_1.default.echo("Error: Build project command failed");
            shelljs_1.default.exit(1);
        }
    }
}
exports.default = ScheduledProgram;
