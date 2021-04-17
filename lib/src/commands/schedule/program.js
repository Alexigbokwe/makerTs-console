"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pathTo = process.env.PWD;
const baseCommand_1 = __importDefault(require("../baseCommand"));
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
