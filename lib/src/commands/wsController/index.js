"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const program_1 = tslib_1.__importDefault(require("./program"));
class WsControllerCommand {
    static async handle(program) {
        await program
            .command("make-ws-controller <wsControllerName>")
            .description("Create a new web socket controller class")
            .action((wsControllerName) => {
            program_1.default.handle(wsControllerName);
        });
    }
}
exports.default = WsControllerCommand;
