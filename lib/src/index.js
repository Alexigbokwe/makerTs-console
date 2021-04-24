"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const pathTo = process.env.PWD;
const commander_1 = tslib_1.__importDefault(require("commander"));
commander_1.default.version("1.0.0").description("ExpressWebJs Command Line TS");
const config_1 = tslib_1.__importDefault(require("./config"));
class Console {
    /**
     * Run Maker commands
     * @param {Array} commands
     * @param {Array} kernel
     */
    static async run(commands, kernel) {
        let makerCommands = this.checkCommadsLength(commands);
        makerCommands != null
            ? await this.processMakerCommands(makerCommands)
            : null;
        let userCommand = this.checkKernelLength(kernel.commands());
        userCommand != null ? await this.processUserCommand(userCommand) : null;
        commander_1.default.parse(process.argv);
    }
    checkCommandName(name) {
        if (typeof config_1.default[name] == "string") {
            throw "Can't recreate maker commend, try renaming your command signature";
        }
    }
    static async processMakerCommands(makerCommands) {
        await makerCommands.forEach((command) => {
            let commandName = command.split("/");
            let filePath = config_1.default[`${commandName[commandName.length - 1]}`];
            Promise.resolve().then(() => tslib_1.__importStar(require(`./${filePath}`))).then(file => {
                file.default.handle(commander_1.default);
            });
        });
    }
    static async processUserCommand(userCommand) {
        userCommand.forEach((path) => {
            let commandPath = `${pathTo}/${path}`;
            let commandObject = require(commandPath);
            let command = new commandObject.default();
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
    static checkCommadsLength(commands) {
        return commands.length > 0 ? commands : null;
    }
    static checkKernelLength(kernel) {
        return kernel.length > 0 ? kernel : null;
    }
}
exports.default = Console;
