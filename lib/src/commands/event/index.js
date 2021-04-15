"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const program_1 = tslib_1.__importDefault(require("./program"));
class EventCommand {
    static async handle(program) {
        await program
            .command("make-event <eventname>")
            .description("Create a new event class")
            .action((eventname) => {
            program_1.default.handle(eventname);
        });
    }
}
exports.default = EventCommand;
