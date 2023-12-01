"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const program_1 = require("./program");
class providerCommand {
    static async handle(program) {
        await program
            .command("make-provider <providerName>")
            .description("Create new service provider class")
            .action((providerName) => {
            program_1.ProviderProgram.handle(providerName);
        });
    }
}
exports.default = providerCommand;
