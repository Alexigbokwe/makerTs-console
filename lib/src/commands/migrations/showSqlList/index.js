"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const program_1 = tslib_1.__importDefault(require("./program"));
class ShowSqlListCommand {
    static async handle(program) {
        await program
            .command("show-sql-list")
            .description("Show list of both completed and pending migrations")
            .action(() => {
            program_1.default.handle();
        });
    }
}
exports.default = ShowSqlListCommand;
