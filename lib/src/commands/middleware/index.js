"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const program_1 = require("./program");
class MiddlewareCommand {
    static async handle(program) {
        await program
            .command("make-middleware <middleWareName>")
            .description("Create a new middleware class")
            .action((middleWareName) => {
            program_1.MiddlewareProgram.handle(middleWareName);
        });
    }
}
exports.default = MiddlewareCommand;
