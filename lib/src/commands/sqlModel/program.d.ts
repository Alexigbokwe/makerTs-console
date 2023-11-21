import { ORM } from "../../Types/CommandTypes";
declare class SqlProgram {
    static handle(name: string, resource: null | undefined, orm: ORM): Promise<void>;
    private static createModel;
    private static TypeORMModelBody;
    private static ObjectionModelBody;
    static modelBody(name: string, orm: ORM): string;
    private static modelBodyWithMigration;
}
export default SqlProgram;
//# sourceMappingURL=program.d.ts.map