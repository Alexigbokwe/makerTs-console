import { Arguments } from "../../Types/CommandTypes";
export declare class ServiceProgram {
    static handle(name: string, broker?: Arguments.broker): Promise<void>;
    private static nextStep;
    private static loadAbstractService;
    private static loadService;
    private static loadServiceBroker;
    static generateServiceAbstractClass(name: string): string;
    static generateService(name: string, addBase?: boolean): string;
    private static generateBroker;
}
//# sourceMappingURL=program.d.ts.map