declare class ServiceProgram {
    static handle(name: string, broker?: null): Promise<void>;
    private static nextStep;
    private static loadInterface;
    private static loadService;
    private static loadServiceBroker;
    static generateServiceInterface(name: string): string;
    static generateService(name: string): string;
    private static generateBroker;
}
export default ServiceProgram;
//# sourceMappingURL=program.d.ts.map