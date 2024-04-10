export declare abstract class Command {
    /**
     * The name and signature of the console command.
     * @var string
     */
    abstract signature: string;
    /**
     * The name and mode of the console command argument.
     * name is the name of the argument while mode can be REQUIRED or OPTIONAL
     * Example [{name: "Debug", mode: "REQUIRED"},{name: "Task", mode: "REQUIRED"}]
     */
    abstract arguments?: CommandArgument;
    /**
     * The console command description.
     * @var string
     */
    abstract description: string;
    /**
     * Execute the console command.
     */
    abstract fire(...args: any[]): void;
}
export declare type CommandArgument = {
    name: string;
    mode: "REQUIRED" | "OPTIONAL";
}[];
//# sourceMappingURL=command.d.ts.map