"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const shelljs_1 = tslib_1.__importDefault(require("shelljs"));
class CompileProgramProgram {
    static handle() {
        this.buildFile();
    }
    static buildFile() {
        if (shelljs_1.default.exec("rimraf ./build && tsc -p .").code !== 0) {
            shelljs_1.default.echo("Error: Build project command failed");
            shelljs_1.default.exit(1);
        }
    }
}
exports.default = CompileProgramProgram;
