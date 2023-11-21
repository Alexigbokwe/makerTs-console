import { Command } from "commander";
import config from "./config";
import { ORM, TCommand } from "./Types/CommandTypes";

const program = new Command();

program.name("maker").version("1.0.2").description("ExpressWebJs Command Line TS");

const modifiedArray = process.argv.map((item) => {
  // Replace one or more '-' at the start of the string with an empty string
  return item.replace(/^[-]+/, "");
});

process.argv = modifiedArray;
class Console {
  private static ormRelated: Array<string> = ["commands/Domain/makeModel", "commands/sqlModel", "commands/Domain/makeDomain", "commands/auth"];
  /**
   * Run Maker commands
   * @param {Array} commands
   * @param {Array} kernel
   */
  public static async run(commands: Array<string>, kernel: any, orm: ORM) {
    let makerCommands = this.checkCommandsLength(commands);
    makerCommands != null ? await this.processMakerCommands(makerCommands, orm) : null;
    let userCommand = this.checkKernelLength(kernel.commands());
    userCommand != null ? await this.processServiceCommand(userCommand) : null;
    program.parse();
  }

  public static checkCommandName(name: string) {
    if (config.has(name)) {
      throw new Error("Can't recreate maker commend, try renaming your command signature");
    }
  }

  private static async processMakerCommands(makerCommands: Array<string>, orm: ORM) {
    for await (let command of makerCommands) {
      let commandName = command.split("/");
      let filePath = config.get(`${commandName[commandName.length - 1]}`);
      if (filePath) {
        let path = filePath;
        await import(`./${path}`).then(async (file) => {
          if (this.ormRelated.includes(path)) {
            await file.default.handle(program, orm);
          } else {
            await file.default.handle(program);
          }
        });
      }
    }
  }

  private static async processServiceCommand(serviceCommand: { new (): TCommand }[]) {
    serviceCommand.forEach((commandObject: { new (): TCommand }) => {
      let command = new commandObject();
      let handle = `${command.signature}`;
      if (command.arguments.length > 0) {
        command.arguments.forEach((argument: { mode: string; name: any }) => {
          if (argument.mode == "REQUIRED") {
            handle = `${handle} <${argument.name.replace(/^[-]+/, "")}>`;
          } else if (argument.mode == "OPTIONAL") {
            handle = `${handle} [${argument.name.replace(/^[-]+/, "")}]`;
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

  private static buildCommandWithArguments(command: TCommand, handle: any) {
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

  private static checkCommandsLength(commands: Array<string>) {
    return commands.length > 0 ? commands : null;
  }

  private static checkKernelLength(kernel: { new (): TCommand }[]) {
    return kernel.length > 0 ? kernel : null;
  }
}
program.parse(process.argv);
export default Console;
