"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const program_1 = tslib_1.__importDefault(require("./program"));
class ListenerCommand {
    static async handle(program) {
        await program
            .command("make-command <commandName>")
            .description("Create a new Maker command")
            .action((commandName) => {
            program_1.default.handle(commandName);
        });
    }
}
exports.default = ListenerCommand;
