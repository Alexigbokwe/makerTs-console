export type CommandArgument = {
  name: string;
  mode: "REQUIRED" | "OPTIONAL";
  description?: string;
};

export type CommandOption = {
  flag: string;
  description: string;
  defaultValue?: any;
};

export abstract class Command {
  /**
   * The name and signature of the console command.
   * @var string
   */
  public abstract signature: string;

  /**
   * The console command arguments.
   * Example: [{ name: "user", mode: "REQUIRED", description: "The name of the user" }]
   */
  public abstract arguments?: CommandArgument[];

  /**
   * The console command options.
   * Example: [{ flag: "-f, --force", description: "Force the command to run" }]
   */
  public abstract options?: CommandOption[];

  /**
   * The console command description.
   * @var string
   */
  public abstract description: string;

  /**
   * Execute the console command.
   * @param args The positional arguments followed by an object containing the parsed options.
   */
  public abstract fire(...args: any[]): void;

  /**
   * Validate command options format
   */
  public validateOptions(): void {
    if (!this.options) return;

    for (const option of this.options) {
      if (!this.isValidFlagFormat(option.flag)) {
        throw new Error(`Invalid flag format for option "${option.flag}". ` + `Flags must start with "--" for long options or "-" for short options. ` + `Example: "--name" or "-n, --name"`);
      }
    }
  }

  /**
   * Check if a flag has valid format
   */
  private isValidFlagFormat(flag: string): boolean {
    const flagParts = flag.split(",").map((part) => part.trim());

    for (const part of flagParts) {
      // Check if it starts with -- (long option) or - (short option)
      if (!part.startsWith("--") && !part.startsWith("-")) {
        return false;
      }

      // If it starts with single -, it should be followed by a single character
      if (part.startsWith("-") && !part.startsWith("--") && part.length !== 2) {
        return false;
      }
    }

    return true;
  }

  /**
   * Get formatted help text for this command
   */
  public getHelpText(): string {
    let help = `\nUsage: ${this.signature}`;

    if (this.arguments && this.arguments.length > 0) {
      help += "\n\nArguments:";
      this.arguments.forEach((arg) => {
        const required = arg.mode === "REQUIRED" ? " (required)" : " (optional)";
        help += `\n  ${arg.name}${required}${arg.description ? ` - ${arg.description}` : ""}`;
      });
    }

    if (this.options && this.options.length > 0) {
      help += "\n\nOptions:";
      this.options.forEach((option) => {
        help += `\n  ${option.flag}${option.description ? ` - ${option.description}` : ""}`;
      });
    }

    return help;
  }
}
