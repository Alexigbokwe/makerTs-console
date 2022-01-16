declare class ControllerProgram {
    static handle(name: string, resource?: null): Promise<void>;
    private static createController;
    private static formatControllerName;
    private static controllerBody;
    static controllerBodyWithResource(name: string): Promise<string>;
}
export default ControllerProgram;
//# sourceMappingURL=program.d.ts.map