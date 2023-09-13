declare class ServiceProgram {
    static handle(name: string, broker?: null): Promise<void>;
    private static nextStep;
    private static loadAbstractService;
    private static loadService;
    private static loadServiceBroker;
    static generateServiceAbstractClass(name: string): string;
    static generateService(name: string, addBase?: boolean): string;
    private static generateBroker;
}
export default ServiceProgram;
//# sourceMappingURL=program.d.ts.map