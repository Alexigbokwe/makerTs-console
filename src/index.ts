import { Command as Commander } from "commander";
import config from "./config";
import { ORM, TCommand } from "./Types/CommandTypes";
import { CommandArgument, Command, CommandOption } from "./command";

const program = new Commander();

export class Console {
  private static ormRelated: string[] = ["commands/Domain/makeModel", "commands/sqlModel", "commands/Domain/makeDomain", "commands/auth"];

  public static async run(commands: string[], kernel: any, orm: ORM) {
    if (commands.length > 0) {
      await this.processMakerCommands(commands, orm);
    }
    if (kernel.commands().length > 0) {
      await this.processServiceCommand(kernel.commands());
    }
    program.parse(process.argv);
  }

  public static checkCommandName(name: string) {
    if (config.has(name)) {
      throw new Error("Can't recreate maker command, try renaming your command signature");
    }
  }

  private static async processMakerCommands(makerCommands: string[], orm: ORM) {
    for (const command of makerCommands) {
      const commandName = command.split("/");
      const filePath = config.get(commandName[commandName.length - 1]);
      if (filePath) {
        try {
          const file = await import(`./${filePath}`);
          if (this.ormRelated.includes(filePath)) {
            await file.default.handle(program, orm);
          } else {
            await file.default.handle(program);
          }
        } catch (error) {
          console.error(`Error loading command ${command}:`, error);
        }
      }
    }
  }

  private static async processServiceCommand(serviceCommands: { new (): TCommand }[]) {
    for (const commandObject of serviceCommands) {
      try {
        const command = new commandObject();

        // Validate command options format
        command.validateOptions();

        let handle = command.signature;

        if (command?.arguments && Array.isArray(command.arguments) && command.arguments.length > 0) {
          command.arguments.forEach((argument) => {
            if (argument.mode === "REQUIRED") {
              handle += ` <${argument.name}>`;
            } else if (argument.mode === "OPTIONAL") {
              handle += ` [${argument.name}]`;
            }
          });
        }

        const cmd = program.command(handle).description(command.description);

        if (command.options && command.options.length > 0) {
          command.options.forEach((option) => {
            try {
              cmd.option(option.flag, option.description, option.defaultValue);
            } catch (error) {
              const errorMessage = error instanceof Error ? error.message : String(error);
              console.error(`\n❌ Error registering option "${option.flag}" for command "${command.signature}":`);
              console.error(`   ${errorMessage}`);
              console.error(`   Make sure your flag format is correct (e.g., "--name" or "-n, --name")`);
              throw error;
            }
          });
        }

        cmd.action((...args: any[]) => {
          try {
            const commandArgs = args.slice(0, args.length - 2);
            const options = args[args.length - 2];
            command.fire(...commandArgs, options);
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error(`\n❌ Error executing command "${command.signature}":`);
            console.error(`   ${errorMessage}`);
            if (errorMessage.includes("too many arguments")) {
              console.error(`\n💡 Tip: Make sure you're using the correct flag format:`);
              console.error(`   ✅ Correct: --name value`);
              console.error(`   ❌ Incorrect: -name value`);
              console.error(`   Use double dashes (--) for named options.`);
            }
            process.exit(1);
          }
        });

        // Add custom error handling for malformed flags
        cmd.on("--help", () => {
          console.log(command.getHelpText());
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`\n❌ Error registering command "${commandObject.name}":`);
        console.error(`   ${errorMessage}`);
        process.exit(1);
      }
    }
  }
}

export { CommandArgument, Command, CommandOption };
