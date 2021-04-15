"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const program_1 = tslib_1.__importDefault(require("./program"));
class SqlRollDownCommand {
    static async handle(program) {
        await program
            .command("sql-rolldown [migrationName]")
            .alias("sqlrd")
            .description("Undo the last or specific migration that was run")
            .action((migrationName) => {
            program_1.default.handle(migrationName);
        });
    }
}
exports.default = SqlRollDownCommand;
