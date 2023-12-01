"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const config_1 = __importDefault(require("./config"));
const program = new commander_1.Command();
class Console {
    /**
     * Run Maker commands
     * @param {Array} commands
     * @param {Array} kernel
     */
    static async run(commands, kernel, orm) {
        let makerCommands = this.checkCommandsLength(commands);
        makerCommands != null ? await this.processMakerCommands(makerCommands, orm) : null;
        let userCommand = this.checkKernelLength(kernel.commands());
        userCommand != null ? await this.processServiceCommand(userCommand) : null;
        program.parse();
    }
    static checkCommandName(name) {
        if (config_1.default.has(name)) {
            throw new Error("Can't recreate maker commend, try renaming your command signature");
        }
    }
    static async processMakerCommands(makerCommands, orm) {
        for await (let command of makerCommands) {
            let commandName = command.split("/");
            let filePath = config_1.default.get(`${commandName[commandName.length - 1]}`);
            if (filePath) {
                let path = filePath;
                await Promise.resolve().then(() => __importStar(require(`./${path}`))).then(async (file) => {
                    if (this.ormRelated.includes(path)) {
                        await file.default.handle(program, orm);
                    }
                    else {
                        await file.default.handle(program);
                    }
                });
            }
        }
    }
    static async processServiceCommand(serviceCommand) {
        serviceCommand.forEach((commandObject) => {
            let command = new commandObject();
            let handle = `${command.signature}`;
            if (command.arguments.length > 0) {
                command.arguments.forEach((argument) => {
                    if (argument.mode == "REQUIRED") {
                        handle = `${handle} <${argument.name.replace(/^[-]+/, "")}>`;
                    }
                    else if (argument.mode == "OPTIONAL") {
                        handle = `${handle} [${argument.name.replace(/^[-]+/, "")}]`;
                    }
                });
                this.buildCommandWithArguments(command, handle);
            }
            else {
                program
                    .command(handle)
                    .description(command.description)
                    .action(() => {
                    command.fire();
                });
            }
        });
    }
    static buildCommandWithArguments(command, handle) {
        let count = command.arguments.length;
        switch (count) {
            case 2:
                program
                    .command(handle)
                    .description(command.description)
                    .action((value1, value2) => {
                    command.fire(value1, value2);
                });
                break;
            case 3:
                program
                    .command(handle)
                    .description(command.description)
                    .action((value1, value2, value3) => {
                    command.fire(value1, value2, value3);
                });
                break;
            case 4:
                program
                    .command(handle)
                    .description(command.description)
                    .action((value1, value2, value3, value4) => {
                    command.fire(value1, value2, value3, value4);
                });
                break;
            case 5:
                program
                    .command(handle)
                    .description(command.description)
                    .action((value1, value2, value3, value4, value5) => {
                    command.fire(value1, value2, value3, value4, value5);
                });
                break;
            default:
                program
                    .command(handle)
                    .description(command.description)
                    .action((value1) => {
                    command.fire(value1);
                });
                break;
        }
    }
    static checkCommandsLength(commands) {
        return commands.length > 0 ? commands : null;
    }
    static checkKernelLength(kernel) {
        return kernel.length > 0 ? kernel : null;
    }
}
Console.ormRelated = ["commands/Domain/makeModel", "commands/sqlModel", "commands/Domain/makeDomain", "commands/auth"];
program.parse(process.argv);
exports.default = Console;
