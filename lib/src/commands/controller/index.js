"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const program_1 = __importDefault(require("./program"));
const CommandTypes_1 = require("../../Types/CommandTypes");
const argumentChecker_1 = require("../../argumentChecker");
class ControllerCommand {
    static async handle(program) {
        program
            .command("make-controller <controllerName>")
            .argument("[r]", "Generate Controller Resource Methods")
            .description("Create a new controller class")
            .action((controllerName, argument) => {
            (0, argumentChecker_1.argumentChecker)({ checker: CommandTypes_1.Arguments.resourceController, argument });
            program_1.default.handle(controllerName, "App/Http/Controller", argument);
        });
    }
}
exports.default = ControllerCommand;
