"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const program_1 = tslib_1.__importDefault(require("./program"));
class MiddlewareCommand {
    static async handle(program) {
        await program
            .command("make-middleware <middlewarename>")
            .description("Create a new middleware class")
            .action((middlewarename) => {
            program_1.default.handle(middlewarename);
        });
    }
}
exports.default = MiddlewareCommand;
