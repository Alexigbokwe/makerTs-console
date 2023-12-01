"use strict";
import { RouteProgram } from "./program";

class RouteCommand {
  static async handle(program: any) {
    await program
      .command("make-route <routeName>")
      .description("Create a new route folder")
      .action((routeName: string) => {
        RouteProgram.handle(routeName);
      });
  }
}

export default RouteCommand;
