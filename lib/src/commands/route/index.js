"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const program_1 = tslib_1.__importDefault(require("./program"));
class RouteCommand {
    static async handle(program) {
        await program
            .command("make-route <routename>")
            .description("Create a new route folder")
            .action((routename) => {
            program_1.default.handle(routename);
        });
    }
}
exports.default = RouteCommand;
