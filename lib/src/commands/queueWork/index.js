"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const program_1 = tslib_1.__importDefault(require("./program"));
class QueueWorkerCommand {
    static async handle(program) {
        await program
            .command("queue-work [queueName]")
            .description("Start processing jobs on the queue as a daemon")
            .action((queueName) => {
            program_1.default.handle(queueName);
        });
    }
}
exports.default = QueueWorkerCommand;
