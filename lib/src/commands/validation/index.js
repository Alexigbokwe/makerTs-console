"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const program_1 = require("./program");
class ValidationCommand {
    static async handle(program) {
        await program
            .command("make-validation <requestname>")
            .description("Create a new validation class")
            .action((requestname) => {
            program_1.ValidationProgram.handle(requestname);
        });
    }
}
exports.default = ValidationCommand;
