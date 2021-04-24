"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const program_1 = tslib_1.__importDefault(require("./program"));
class AuthCommand {
    static async handle(program) {
        await program
            .command("run-build")
            .description("Compile project to JavaScript")
            .action(() => {
            program_1.default.handle();
        });
    }
}
exports.default = AuthCommand;
