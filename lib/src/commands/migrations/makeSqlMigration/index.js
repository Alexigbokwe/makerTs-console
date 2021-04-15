"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const program_1 = tslib_1.__importDefault(require("./program"));
class MakeSqlMigratiomCommand {
    static async handle(program) {
        await program
            .command("make-sql-migration <migrationName>")
            .alias("msqlm")
            .description("Create a new migration file")
            .action((migrationName) => {
            program_1.default.handle(migrationName);
        });
    }
}
exports.default = MakeSqlMigratiomCommand;
