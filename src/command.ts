export abstract class Command {
  /**
   * The name and signature of the console command.
   * @var string
   */
  public abstract signature: string;

  /**
   * The name and mode of the console command argument.
   * name is the name of the argument while mode can be REQUIRED or OPTIONAL
   * Example [{name: "Debug", mode: "REQUIRED"},{name: "Task", mode: "REQUIRED"}]
   */
  public abstract arguments?: CommandArgument;

  /**
   * The console command description.
   * @var string
   */
  public abstract description: string;

  /**
   * Execute the console command.
   */
  public abstract fire(...args: any[]): void;
}

export type CommandArgument = {
  name: string;
  mode: "REQUIRED" | "OPTIONAL";
}[];
