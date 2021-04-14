"use strict";
import jobProgram from "./program";

class JobCommand {
  static async handle(program:any) {
    await program
      .command("make-job [jobName]")
      .description("Create a new job class")
      .action((jobName: string) => {
        jobProgram.handle(jobName);
      });
  }
}

export default JobCommand;
