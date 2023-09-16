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
exports.ORM = void 0;
const commander_1 = __importDefault(require("commander"));
commander_1.default.name("maker").version("1.0.1").description("ExpressWebJs Command Line TS");
const config_1 = __importDefault(require("./config"));
var mode;
(function (mode) {
    mode["REQUIRED"] = "REQUIRED";
    mode["OPTIONAL"] = "OPTIONAL";
})(mode || (mode = {}));
var ORM;
(function (ORM) {
    ORM["Objection"] = "Objection";
    ORM["Mongoose"] = "Mongoose";
    ORM["TypeORM"] = "TypeORM";
})(ORM = exports.ORM || (exports.ORM = {}));
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
        commander_1.default.parse(process.argv);
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
                await Promise.resolve().then(() => __importStar(require(`./${path}`))).then((file) => {
                    if (this.ormRelated.includes(path)) {
                        file.default.handle(commander_1.default, orm);
                    }
                    else {
                        file.default.handle(commander_1.default);
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
                        handle = `${handle} <${argument.name}>`;
                    }
                    else if (argument.mode == "OPTIONAL") {
                        handle = `${handle} [${argument.name}]`;
                    }
                });
                this.buildCommandWithArguments(command, handle);
            }
            else {
                commander_1.default
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
                commander_1.default
                    .command(handle)
                    .description(command.description)
                    .action((value1, value2) => {
                    command.fire(value1, value2);
                });
                break;
            case 3:
                commander_1.default
                    .command(handle)
                    .description(command.description)
                    .action((value1, value2, value3) => {
                    command.fire(value1, value2, value3);
                });
                break;
            case 4:
                commander_1.default
                    .command(handle)
                    .description(command.description)
                    .action((value1, value2, value3, value4) => {
                    command.fire(value1, value2, value3, value4);
                });
                break;
            case 5:
                commander_1.default
                    .command(handle)
                    .description(command.description)
                    .action((value1, value2, value3, value4, value5) => {
                    command.fire(value1, value2, value3, value4, value5);
                });
                break;
            default:
                commander_1.default
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
commander_1.default.parse(process.argv);
exports.default = Console;
