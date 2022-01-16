declare class SqlProgram {
    static handle(name: string, resource?: null): Promise<void>;
    private static createModel;
    private static TypeORMModelBody;
    private static ObjecionModelBody;
    static modelBody(name: string): string;
    private static modelBodyWithMigration;
}
export default SqlProgram;
//# sourceMappingURL=program.d.ts.map