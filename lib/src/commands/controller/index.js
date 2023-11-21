"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const program_1 = __importDefault(require("./program"));
class ControllerCommand {
    static async handle(program) {
        program
            .command("make-controller <controllerName>")
            .option("-r", "-resource", "Controller Resource Methods")
            .description("Create a new controller class")
            .action((controllerName, resource) => {
            program_1.default.handle(controllerName, resource.r);
        });
    }
}
exports.default = ControllerCommand;
