"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const program_1 = tslib_1.__importDefault(require("./program"));
class RunSqlMigratiomCommand {
    static async handle(program) {
        await program
            .command("run-sql-migration")
            .alias("rsqlm")
            .description("Run Sql Migrations")
            .action(() => {
            program_1.default.handle();
        });
    }
}
exports.default = RunSqlMigratiomCommand;
