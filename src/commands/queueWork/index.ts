"use strict";
import { QueueWorkerProgram } from "./program";

class QueueWorkerCommand {
  static async handle(program: any) {
    await program
      .command("queue-work [queueName]")
      .description("Start processing jobs on the queue as a daemon")
      .action((queueName: string) => {
        QueueWorkerProgram.handle(queueName);
      });
  }
}

export default QueueWorkerCommand;
