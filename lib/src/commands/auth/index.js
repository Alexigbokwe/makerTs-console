"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const program_1 = __importDefault(require("./program"));
class AuthCommand {
    static async handle(program, orm) {
        await program
            .command("make-auth")
            .description("Create a new auth class")
            .action(() => {
            program_1.default.handle(orm);
        });
    }
}
exports.default = AuthCommand;
