declare class RouteProgram {
    static handle(name: string): Promise<void>;
    private static nextStep;
    private static routeFolder;
    static routeBody(name: string): Promise<string>;
}
export default RouteProgram;
//# sourceMappingURL=program.d.ts.map