"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const program_1 = require("./program");
class ListenerCommand {
    static async handle(program) {
        await program
            .command("make-listener <listenerName>")
            .description("Create a new listener class")
            .action((listenerName) => {
            program_1.ListenerProgram.handle(listenerName);
        });
    }
}
exports.default = ListenerCommand;
