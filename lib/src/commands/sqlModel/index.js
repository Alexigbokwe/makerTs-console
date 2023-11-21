"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const OptionChecker_1 = require("../../OptionChecker");
const program_1 = __importDefault(require("./program"));
class SqlCommand {
    static async handle(program, orm) {
        await program
            .command("make-sql-model <modelname>")
            .option("-m", "-migration", "Generate migration with sql model")
            .description("Create a new sql model class")
            .action((modelname, resource) => {
            (0, OptionChecker_1.commandOptionChecker)(resource);
            program_1.default.handle(modelname, resource.m, orm);
        });
    }
}
exports.default = SqlCommand;
