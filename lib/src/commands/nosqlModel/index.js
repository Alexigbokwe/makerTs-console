"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const program_1 = require("./program");
class NoSqlCommand {
    static async handle(program) {
        await program
            .command("make-nosql-model <modelname>")
            .description("Create a new nosql model class")
            .action((modelname) => {
            program_1.NoSqlProgram.handle(modelname);
        });
    }
}
exports.default = NoSqlCommand;
