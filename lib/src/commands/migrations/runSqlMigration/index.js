"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const program_1 = require("./program");
class RunSqlMigrationCommand {
    static async handle(program) {
        await program
            .command("run-sql-migration")
            .alias("rsqlm")
            .description("Run Sql Migrations")
            .action(() => {
            program_1.RunSqlMigrationProgram.handle();
        });
    }
}
exports.default = RunSqlMigrationCommand;
