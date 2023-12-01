"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CommandTypes_1 = require("../../Types/CommandTypes");
const program_1 = require("./program");
const argumentChecker_1 = require("../../argumentChecker");
class SqlCommand {
    static async handle(program, orm) {
        await program
            .command("make-sql-model <modelName>")
            .argument("[m]", "Generate migration with sql model")
            .description("Create a new sql model class")
            .action((modelName, argument) => {
            (0, argumentChecker_1.argumentChecker)({ checker: CommandTypes_1.Arguments.migration, argument });
            program_1.SqlProgram.handle(modelName, orm, argument);
        });
    }
}
exports.default = SqlCommand;
