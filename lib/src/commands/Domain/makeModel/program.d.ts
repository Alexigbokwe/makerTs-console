import { ORM } from "../../../Types/CommandTypes";
declare class MakeDomainModelProgram {
    static handle(modelName: string, domainName: string, orm: ORM): Promise<void>;
    private static nextStep;
    private static modelBody;
    private static domainExist;
}
export default MakeDomainModelProgram;
//# sourceMappingURL=program.d.ts.map