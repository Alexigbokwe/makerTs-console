export declare enum ORM {
    Objection = "Objection",
    Mongoose = "Mongoose",
    TypeORM = "TypeORM"
}
declare class Console {
    private static ormRelated;
    /**
     * Run Maker commands
     * @param {Array} commands
     * @param {Array} kernel
     */
    static run(commands: Array<string>, kernel: any, orm: ORM): Promise<void>;
    static checkCommandName(name: string): void;
    private static processMakerCommands;
    private static processServiceCommand;
    private static buildCommandWithArguments;
    private static checkCommandsLength;
    private static checkKernelLength;
}
export default Console;
//# sourceMappingURL=index.d.ts.map