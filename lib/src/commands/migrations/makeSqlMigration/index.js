"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const program_1 = require("./program");
class MakeSqlMigrationCommand {
    static async handle(program) {
        await program
            .command("make-sql-migration <migrationName>")
            .alias("msqlm")
            .description("Create a new migration file")
            .action((migrationName) => {
            program_1.MakeSqlMigrationProgram.handle(migrationName);
        });
    }
}
exports.default = MakeSqlMigrationCommand;
