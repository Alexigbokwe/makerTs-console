"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const program_1 = tslib_1.__importDefault(require("./program"));
class providerCommand {
    static async handle(program) {
        await program
            .command("make-provider [providerName]")
            .description("Create new service provider class")
            .action((providerName) => {
            program_1.default.handle(providerName);
        });
    }
}
exports.default = providerCommand;
