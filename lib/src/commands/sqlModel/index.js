"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const program_1 = tslib_1.__importDefault(require("./program"));
class SqlCommand {
    static async handle(program) {
        await program
            .command("make-sql-model <modelname>")
            .option("-m", "-migration", "Generation migration with sql model")
            .description("Create a new sql model class")
            .action((modelname, resource) => {
            program_1.default.handle(modelname, resource.m);
        });
    }
}
exports.default = SqlCommand;
