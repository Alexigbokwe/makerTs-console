"use strict";
import queueWorkerProgram from "./program";

class QueueWorkerCommand {
  static async handle(program:any) {
    await program
      .command("queue-work [queueName]")
      .description("Start processing jobs on the queue as a daemon")
      .action((queueName:string) => {
        queueWorkerProgram.handle(queueName);
      });
  }
}

export default QueueWorkerCommand;
