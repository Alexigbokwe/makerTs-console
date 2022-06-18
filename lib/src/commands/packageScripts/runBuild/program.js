"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const shelljs_1 = __importDefault(require("shelljs"));
const recursive_copy_1 = __importDefault(require("recursive-copy"));
//@ts-ignore
const app_ts_1 = __importDefault(require("../../../../../../../Config/app.ts"));
class CompileProgramProgram {
    static handle() {
        this.buildFile();
    }
    static buildFile() {
        if (shelljs_1.default.exec("rimraf ./build && tsc -p .").code !== 0) {
            shelljs_1.default.echo("Error: Build project command failed");
            shelljs_1.default.exit(1);
        }
        else {
            let directories = app_ts_1.default.static_directories;
            if (directories.length > 0) {
                this.copyStaticDirectories(directories);
            }
        }
    }
    static copyStaticDirectories(directories) {
        directories.map((directory) => {
            (0, recursive_copy_1.default)(process.cwd() + "/" + directory.source, process.cwd() + "/" + directory.destination).catch(function (error) {
                console.error("Copy failed: " + error);
            });
        });
    }
}
exports.default = CompileProgramProgram;
