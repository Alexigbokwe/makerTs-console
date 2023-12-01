import { Arguments } from "../../../Types/CommandTypes";
declare class MakeDomainControllerProgram {
    static handle(controllerName: string, domainName: string, resource?: Arguments.resourceController): Promise<void>;
    private static nextStep;
    private static domainExist;
}
export default MakeDomainControllerProgram;
//# sourceMappingURL=program.d.ts.map