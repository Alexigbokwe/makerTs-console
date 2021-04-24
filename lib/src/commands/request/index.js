"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const program_1 = tslib_1.__importDefault(require("./program"));
class RequestCommand {
    static async handle(program) {
        await program
            .command("make-request <requestname>")
            .description("Create a new request class")
            .action((requestname) => {
            program_1.default.handle(requestname);
        });
    }
}
exports.default = RequestCommand;
