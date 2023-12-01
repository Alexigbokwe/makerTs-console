"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const program_1 = require("./program");
class SqlRollDownCommand {
    static async handle(program) {
        await program
            .command("sql-rolldown [migrationName]")
            .alias("sqlrd")
            .description("Undo the last or specific migration that was run")
            .action((migrationName) => {
            program_1.SqlRollDownProgram.handle(migrationName);
        });
    }
}
exports.default = SqlRollDownCommand;
