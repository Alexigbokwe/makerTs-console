"use strict";
// import "../expresswebcorets/alias";
// import "../expresswebcorets/Database/src/index";
const pathTo = process.env.PWD;
import program from "commander";
program.version("1.0.0").description("ExpressWebJs Command Line TS");
import config from "./config";
import commandSwitch from "./commandSwitch";


class Console {
  /**
   * Run Maker commands
   * @param {Array} commands
   * @param {Array} kernel
   */
  static async run() {
    let commands = commandSwitch;
    let makerCommands = this.checkCommadsLength(commands);
    makerCommands != null
      ? await this.processMakerCommands(makerCommands)
      : null;
    //let userCommand = this.checkKernelLength(kernel.commands());
    //userCommand != null ? await this.processUserCommand(userCommand) : null;
    program.parse(process.argv);
  }

  // static async run(commands: any, kernel: { commands: Function; }) {
  //   let makerCommands = this.checkCommadsLength(commands);
  //   makerCommands != null
  //     ? await this.processMakerCommands(makerCommands)
  //     : null;
  //   //let userCommand = this.checkKernelLength(kernel.commands());
  //   //userCommand != null ? await this.processUserCommand(userCommand) : null;
  //   program.parse(process.argv);
  // }

  checkCommandName(name: string) {
    if (typeof config.commands[name] == "string") {
      throw "Can't recreate maker commend, try renaming your command signature";
    }
  }

  private static async processMakerCommands(makerCommands: any) {
    await makerCommands.forEach((command: string) => {
      let commandName = command.split("/");
      let filePath = config[`${commandName[commandName.length - 1]}`];
      import(`./${filePath}`).then(file => {
        file.default.handle(program);
      })
    });
  }

  private static async processUserCommand(userCommand: any) {
    userCommand.forEach((path: any) => {
      let commandPath = `${pathTo}/${path}`;
      let commandObject = require(commandPath);
      let command = new commandObject();
      let handle = `${command.signature}`;
      if (command.arguments.length > 0) {
        command.arguments.forEach((argument: { mode: string; name: any; }) => {
          if (argument.mode == "REQUIRED") {
            handle = `${handle} <${argument.name}>`;
          } else if (argument.mode == "OPTIONAL") {
            handle = `${handle} [${argument.name}]`;
          }
        });
        this.buildCommandWithArguments(command, handle);
      } else {
        program
          .command(handle)
          .description(command.description)
          .action(() => {
            command.fire();
          });
      }
    });
  }

  private static buildCommandWithArguments(command:any,handle:any ) {
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

  private static checkCommadsLength(commands: string | any[]) {
    return commands.length > 0 ? commands : null;
  }

  private static checkKernelLength(kernel: string | any[]) {
    return kernel.length > 0 ? kernel : null;
  }
}

export default Console.run();
