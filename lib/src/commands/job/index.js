"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const program_1 = tslib_1.__importDefault(require("./program"));
class JobCommand {
    static async handle(program) {
        await program
            .command("make-job [jobName]")
            .description("Create a new job class")
            .action((jobName) => {
            program_1.default.handle(jobName);
        });
    }
}
exports.default = JobCommand;
