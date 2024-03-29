"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const shelljs_1 = __importDefault(require("shelljs"));
class DevelopmentServerProgram {
    static async handle() {
        this.runDevServer();
    }
    static runDevServer() {
        if (shelljs_1.default.exec('tsc-watch --onSuccess "node -r tsconfig-paths/register -r ts-node/register app.ts "').code !== 0) {
            shelljs_1.default.echo("Error: Run development server command failed");
            shelljs_1.default.exit(1);
        }
    }
}
exports.default = DevelopmentServerProgram;
