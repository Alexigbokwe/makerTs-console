"use strict";
import { JobProgram } from "./program";

class JobCommand {
  static async handle(program: any) {
    await program
      .command("make-job [jobName]")
      .description("Create a new job class")
      .action((jobName: string) => {
        JobProgram.handle(jobName);
      });
  }
}

export default JobCommand;
