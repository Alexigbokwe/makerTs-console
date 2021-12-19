declare class ServiceProgram {
    static handle(name: string, broker?: null): Promise<void>;
    private static nextStep;
    private static loadInterface;
    private static loadService;
    private static loadServiceBroker;
    private static generateServiceInterface;
    private static generateService;
    private static generateBroker;
}
export default ServiceProgram;
//# sourceMappingURL=program.d.ts.map