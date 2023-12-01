"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
exports.QueueWorkerProgram = void 0;
const RootDirectory_1 = require("../../RootDirectory");
const baseCommand_1 = __importDefault(require("../baseCommand"));
require("dotenv").config();
const fs_1 = __importDefault(require("fs"));
let configQueuePath = `${RootDirectory_1.projectDirectory}/Config/queue`;
let jobDirectories = `${RootDirectory_1.projectDirectory}/App/Jobs`;
let tsRPC_ConsumerDirectories = `${RootDirectory_1.projectDirectory}/App/RPC_Consumer`;
var queueProviders;
(function (queueProviders) {
    queueProviders["Bull"] = "bull";
    queueProviders["BullMQ"] = "bullmq";
    queueProviders["RABBITMQ"] = "rabbitmq";
})(queueProviders || (queueProviders = {}));
class QueueWorkerProgram {
    static async handle(name) {
        await Promise.resolve().then(() => __importStar(require(configQueuePath))).then((file) => {
            const Config = Object.values(file)[0];
            switch (Config.default) {
                case "rabbitmq":
                    this.consumeViaRabbitmq(name, Config);
                    break;
                case "redis":
                    this.consumeViaRedis(name, Config);
                    break;
                default:
                    break;
            }
        });
    }
    static consumeViaRedis(jobQueue = null, Config) {
        try {
            let queue = jobQueue;
            if (queue == null)
                queue = Config.connections[Config.default].queue;
            const provider_name = Config.connections[Config.default].provider_name;
            switch (provider_name) {
                case queueProviders.Bull:
                    this.processBullQueue(queue, Config);
                    break;
                case queueProviders.BullMQ:
                    this.processBullMQueue(queue, Config);
                    break;
                default:
                    throw new Error("Invalid redis provider name");
            }
        }
        catch (error) {
            baseCommand_1.default.error(error.message);
        }
    }
    static processBullMQueue(queue, Config) {
        const { Worker } = require("bullmq");
        baseCommand_1.default.success(`[*] Waiting for messages in ${queue} queue. To exit press CTRL+C`);
        new Worker(queue, async (job) => {
            baseCommand_1.default.success("Data Received");
            return this.callJobHandlers({
                data: job.data,
                signature: job.name,
            });
        }, { connection: { port: Config.connections[Config.default].port, host: Config.connections[Config.default].host, password: Config.connections[Config.default].password } });
    }
    static processBullQueue(queue, Config) {
        const job = require("bull");
        let connection = new job(queue, { redis: { port: Config.connections[Config.default].port, host: Config.connections[Config.default].host, password: Config.connections[Config.default].password } });
        baseCommand_1.default.success(`[*] Waiting for messages in ${queue} queue. To exit press CTRL+C`);
        connection.process((job, done) => {
            job.progress("fetching data");
            let data = job.data;
            job.progress("fetched data");
            baseCommand_1.default.success("Data Received");
            job.progress("Processing job");
            this.callJobHandlers(data);
            job.progress("Done processing job");
            done();
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
                        this.callJobHandlers(data);
                        channel.ack(msg);
                    });
                });
            });
        }
        catch (error) {
            baseCommand_1.default.error(error.message);
        }
    }
    static async callJobHandlers(msg = null) {
        const files = fs_1.default.readdirSync(`${jobDirectories}/`);
        let error = null;
        for await (let file of files) {
            await Promise.resolve().then(() => __importStar(require(`${jobDirectories}/${file}`))).then(async (f) => {
                const jobObject = Object.values(f)[0];
                let job = new jobObject();
                if (job.signature == msg.signature) {
                    let methods = this.getAllMethodsInClass(job);
                    if (methods.includes("handle")) {
                        await job.handle(msg.data).catch((e) => {
                            error = e;
                        });
                    }
                }
            });
        }
        if (error) {
            throw new Error(error?.message);
        }
    }
    static getAllMethodsInClass(value) {
        let props = [];
        let obj = value;
        do {
            props = props.concat(Object.getOwnPropertyNames(obj));
        } while ((obj = Object.getPrototypeOf(obj)));
        return props.sort().filter((e, i, arr) => {
            if (e != arr[i + 1] && typeof value[e] == "function")
                return true;
        });
    }
}
exports.QueueWorkerProgram = QueueWorkerProgram;
