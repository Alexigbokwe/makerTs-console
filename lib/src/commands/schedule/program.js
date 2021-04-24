"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const pathTo = process.env.PWD;
const baseCommand_1 = tslib_1.__importDefault(require("../baseCommand"));
class ScheduledProgram {
    static async handle() {
        let path = `${pathTo}/App/Console/kernel.ts`;
        let kernel = require(path);
        try {
            baseCommand_1.default.success("Running scheduled command");
            kernel.schedule();
        }
        catch (error) {
            baseCommand_1.default.error(error);
        }
    }
}
exports.default = ScheduledProgram;
