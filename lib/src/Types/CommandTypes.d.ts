export declare enum mode {
    REQUIRED = "REQUIRED",
    OPTIONAL = "OPTIONAL"
}
export declare type TCommand = {
    signature: string;
    arguments: {
        name: string;
        mode: mode;
    }[];
    description: string;
    fire(...args: any): any;
};
export declare enum ORM {
    Objection = "Objection",
    Mongoose = "Mongoose",
    TypeORM = "TypeORM"
}
export declare enum Arguments {
    migration = "m",
    broker = "b",
    resourceController = "r"
}
//# sourceMappingURL=CommandTypes.d.ts.map