"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const baseCommand_1 = tslib_1.__importDefault(require("../baseCommand"));
require('dotenv').config();
const path_1 = tslib_1.__importDefault(require("path"));
const shelljs_1 = tslib_1.__importDefault(require("shelljs"));
let configQueuePath = path_1.default + "../../../../../build/Config/queue";
let tsJobDirectories = `${__dirname}/../../../../../../App/Jobs`;
let jsJobDirectories = `${__dirname}/../../../../../../build/App/Jobs`;
//@ts-ignore
const fs_1 = tslib_1.__importDefault(require("fs"));
class QueueWorkerProgram {
    static async handle(name) {
        this.buildFile();
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
    static buildFile() {
        if (shelljs_1.default.exec("tsc -p .").code !== 0) {
            shelljs_1.default.echo("Error: Build project command failed");
            shelljs_1.default.exit(1);
        }
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
            let filename = file.split(".");
            await Promise.resolve().then(() => tslib_1.__importStar(require(`${jsJobDirectories}/${filename[0]}.js`))).then((f) => {
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
