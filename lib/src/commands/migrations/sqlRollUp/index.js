"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const program_1 = require("./program");
class SqlRollUpCommand {
    static async handle(program) {
        await program
            .command("sql-rollup [migrationName]")
            .alias("sqlru")
            .description("Run the next or specific migration that has not yet been run")
            .action((migrationName) => {
            program_1.SqlRollUpProgram.handle(migrationName);
        });
    }
}
exports.default = SqlRollUpCommand;
