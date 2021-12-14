declare class QueueWorkerProgram {
    static handle(name: string): Promise<void>;
    private static consumeViaRabbitmq;
    private static callJobHandlers;
    private static callRPCHandlers;
}
export default QueueWorkerProgram;
//# sourceMappingURL=program.d.ts.map