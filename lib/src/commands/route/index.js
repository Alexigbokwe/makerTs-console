"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const program_1 = require("./program");
class RouteCommand {
    static async handle(program) {
        await program
            .command("make-route <routeName>")
            .description("Create a new route folder")
            .action((routeName) => {
            program_1.RouteProgram.handle(routeName);
        });
    }
}
exports.default = RouteCommand;
