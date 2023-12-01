"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const program_1 = require("./program");
class JobCommand {
    static async handle(program) {
        await program
            .command("make-job [jobName]")
            .description("Create a new job class")
            .action((jobName) => {
            program_1.JobProgram.handle(jobName);
        });
    }
}
exports.default = JobCommand;
