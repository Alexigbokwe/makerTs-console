"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const program_1 = require("./program");
class EventCommand {
    static async handle(program) {
        await program
            .command("make-event <eventname>")
            .description("Create a new event class")
            .action((eventname) => {
            program_1.EventProgram.handle(eventname);
        });
    }
}
exports.default = EventCommand;
