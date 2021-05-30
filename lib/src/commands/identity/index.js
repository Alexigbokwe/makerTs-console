"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const program_1 = __importDefault(require("./program"));
class EventCommand {
    static async handle(program) {
        await program
            .command("make-identity")
            .description("Create identity manager")
            .action(() => {
            program_1.default.handle();
        });
    }
}
exports.default = EventCommand;
