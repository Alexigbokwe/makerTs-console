"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const program_1 = tslib_1.__importDefault(require("./program"));
class ListenerCommand {
    static async handle(program) {
        await program
            .command("run-schedule")
            .description("Run the scheduled commands")
            .action(() => {
            program_1.default.handle();
        });
    }
}
exports.default = ListenerCommand;
