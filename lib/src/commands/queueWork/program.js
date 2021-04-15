"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const baseCommand_1 = tslib_1.__importDefault(require("../baseCommand"));
require('dotenv').config();
//@ts-ignore
const queue_1 = tslib_1.__importDefault(require("../../../../App/Config/queue"));
const fs_1 = tslib_1.__importDefault(require("fs"));
class QueueWorkerProgram {
    static async handle(name) {
        switch (queue_1.default.default) {
            case "rabbitmq":
                this.consumeViaRabbitmq(name);
                break;
            default:
                break;
        }
    }
    static consumeViaRabbitmq(jobQueue = null) {
        let queue = jobQueue;
        const amqp = require("amqplib/callback_api");
        try {
            amqp.connect(`${queue_1.default.connections[queue_1.default.default].host}:${queue_1.default.connections[queue_1.default.default].port}`, (error, connect) => {
                if (error)
                    throw error;
                if (queue == null)
                    queue = queue_1.default.connections[queue_1.default.default].queue;
                connect.createChannel((channelError, channel) => {
                    if (channelError)
                        baseCommand_1.default.error(channelError.message);
                    channel.assertQueue(queue);
                    baseCommand_1.default.success(`[*] Waiting for messages in ${queue} queue. To exit press CTRL+C`);
                    channel.consume(queue, (msg) => {
                        baseCommand_1.default.success(`Received ${msg.content.toString()}`);
                        let data = JSON.parse(msg.content.toString());
                        this.callHandlers(data);
                        channel.ack(msg);
                    });
                });
            });
        }
        catch (error) {
            baseCommand_1.default.error(error.message);
        }
    }
    static callHandlers(msg = null) {
        fs_1.default.readdirSync(`${__dirname}/../../../../App/Jobs/`).forEach(async (file) => {
            await Promise.resolve().then(() => tslib_1.__importStar(require(`${__dirname}/../../../../App/Jobs/${file}`))).then((f) => {
                let jobObject = f.default;
                let job = new jobObject();
                if (job.signature == msg.signature) {
                    try {
                        job.handle(msg.data);
                    }
                    catch (e) {
                        console.log(e);
                    }
                }
            });
        });
    }
}
exports.default = QueueWorkerProgram;
