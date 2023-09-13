"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const program_1 = __importDefault(require("./program"));
class ValidationCommand {
    static async handle(program) {
        await program
            .command("make-validation <requestname>")
            .description("Create a new validation class")
            .action((requestname) => {
            program_1.default.handle(requestname);
        });
    }
}
exports.default = ValidationCommand;
