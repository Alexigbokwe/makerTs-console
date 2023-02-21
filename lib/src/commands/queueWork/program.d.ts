declare class QueueWorkerProgram {
    static handle(name: string): Promise<void>;
    private static consumeViaRedis;
    private static processBullMQueue;
    private static processBullQueue;
    private static consumeViaRabbitmq;
    private static callJobHandlers;
    private static getAllMethodsInClass;
}
export default QueueWorkerProgram;
//# sourceMappingURL=program.d.ts.map