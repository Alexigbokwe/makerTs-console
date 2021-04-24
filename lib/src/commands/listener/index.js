"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const program_1 = tslib_1.__importDefault(require("./program"));
class ListenerCommand {
    static async handle(program) {
        await program
            .command("make-listener <listenername>")
            .description("Create a new listener class")
            .action((listenername) => {
            program_1.default.handle(listenername);
        });
    }
}
exports.default = ListenerCommand;
