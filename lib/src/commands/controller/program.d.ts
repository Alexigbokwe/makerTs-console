import { Arguments } from "../../Types/CommandTypes";
declare class ControllerProgram {
    static handle(name: string, directoryPath: string, resource?: Arguments.resourceController): Promise<void>;
    private static createController;
    private static formatControllerName;
    private static controllerBody;
    static controllerBodyWithResource(name: string): Promise<string>;
}
export default ControllerProgram;
//# sourceMappingURL=program.d.ts.map