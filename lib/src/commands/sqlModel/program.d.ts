import { Arguments, ORM } from "../../Types/CommandTypes";
export declare class SqlProgram {
    static handle(name: string, orm: ORM, migration?: Arguments.migration): Promise<void>;
    private static createModel;
    private static TypeORMModelBody;
    private static ObjectionModelBody;
    static modelBody(name: string, orm: ORM): string;
    private static modelBodyWithMigration;
}
//# sourceMappingURL=program.d.ts.map