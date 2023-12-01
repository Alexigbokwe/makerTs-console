"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const program_1 = require("./program");
class ListenerCommand {
    static async handle(program) {
        await program
            .command("make-command <commandName>")
            .description("Create a new Maker command")
            .action((commandName) => {
            program_1.ConsoleProgram.handle(commandName);
        });
    }
}
exports.default = ListenerCommand;
