"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const program_1 = require("./program");
class QueueWorkerCommand {
    static async handle(program) {
        await program
            .command("queue-work [queueName]")
            .description("Start processing jobs on the queue as a daemon")
            .action((queueName) => {
            program_1.QueueWorkerProgram.handle(queueName);
        });
    }
}
exports.default = QueueWorkerCommand;
