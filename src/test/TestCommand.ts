import { Command, CommandOption, CommandArgument } from "../command";

interface TestCommandOptions {
  name?: string;
  greeting?: string;
}

export class TestCommand extends Command {
  public signature = "test:command";
  public description = "An Artisan-style test command.";

  public arguments: CommandArgument[] = [{ name: "name", mode: "REQUIRED", description: "The name to greet" }];

  public options: CommandOption[] = [
    {
      flag: "--greeting <greeting>",
      description: "An optional greeting.",
      defaultValue: "Hello",
    },
  ];

  public fire(name: string, options: TestCommandOptions): void {
    const greeting = options.greeting || "Hello";
    console.log(`\n✅ ${greeting}, ${name}!`);
    console.log("   Artisan-style test command executed successfully.\n");
  }
}
