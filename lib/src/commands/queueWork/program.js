"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const baseCommand_1 = tslib_1.__importDefault(require("../baseCommand"));
require('dotenv').config();
let configQueuePath = `${__dirname}/../../../../../../Config/queue`;
let tsJobDirectories = `${__dirname}/../../../../../../App/Jobs`;
//@ts-ignore
const fs_1 = tslib_1.__importDefault(require("fs"));
class QueueWorkerProgram {
    static async handle(name) {
        await Promise.resolve().then(() => tslib_1.__importStar(require(configQueuePath))).then(file => {
            let Config = file.default;
            switch (Config.default) {
                case "rabbitmq":
                    this.consumeViaRabbitmq(name, Config);
                    break;
                default:
                    break;
            }
        });
    }
    static consumeViaRabbitmq(jobQueue = null, Config) {
        let queue = jobQueue;
        const amqp = require("amqplib/callback_api");
        try {
            amqp.connect(`${Config.connections[Config.default].host}:${Config.connections[Config.default].port}`, (error, connect) => {
                if (error)
                    throw error;
                if (queue == null)
                    queue = Config.connections[Config.default].queue;
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
        fs_1.default.readdirSync(`${tsJobDirectories}/`).forEach(async (file) => {
            await Promise.resolve().then(() => tslib_1.__importStar(require(`${tsJobDirectories}/${file}`))).then((f) => {
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
