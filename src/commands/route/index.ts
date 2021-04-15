"use strict";
import routeProgram from "./program";

class RouteCommand {
  static async handle(program:any) {
    await program
      .command("make-route <routename>")
      .description("Create a new route folder")
      .action((routename:string) => {
        routeProgram.handle(routename);
      });
  }
}

export default RouteCommand;
