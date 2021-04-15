"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const program_1 = tslib_1.__importDefault(require("./program"));
class NoSqlCommand {
    static async handle(program) {
        await program
            .command("make-nosql-model <modelname>")
            .description("Create a new nosql model class")
            .action((modelname) => {
            program_1.default.handle(modelname);
        });
    }
}
exports.default = NoSqlCommand;
