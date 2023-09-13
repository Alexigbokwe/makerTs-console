"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const program_1 = __importDefault(require("./program"));
class ProductionCommand {
    static async handle(program) {
        await program
            .command("run-prod")
            .description("Run in production server")
            .action(() => {
            program_1.default.handle();
        });
    }
}
exports.default = ProductionCommand;
