"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const program_1 = require("./program");
class ListenerCommand {
    static async handle(program) {
        await program
            .command("run-schedule")
            .description("Run the scheduled commands")
            .action(() => {
            program_1.ScheduledProgram.handle();
        });
    }
}
exports.default = ListenerCommand;
