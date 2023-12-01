"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const program_1 = require("./program");
class WsControllerCommand {
    static async handle(program) {
        await program
            .command("make-ws-controller <wsControllerName>")
            .description("Create a new web socket controller class")
            .action((wsControllerName) => {
            program_1.WsControllerProgram.handle(wsControllerName);
        });
    }
}
exports.default = WsControllerCommand;
