"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const baseCommand_1 = __importDefault(require("../baseCommand"));
require('dotenv').config();
//@ts-ignore
const queue_1 = __importDefault(require("../../../../App/Config/queue"));
const fs_1 = __importDefault(require("fs"));
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
            await Promise.resolve().then(() => __importStar(require(`${__dirname}/../../../../App/Jobs/${file}`))).then((f) => {
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