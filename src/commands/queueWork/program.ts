"use strict";
import BaseCommand from "../baseCommand";
require('dotenv').config();
//@ts-ignore
import Config from "../../../../App/Config/queue";
import FS from "fs";

class QueueWorkerProgram {
  static async handle(name:string) {
    switch (Config.default) {
        case "rabbitmq":
            this.consumeViaRabbitmq(name);
            break;
        default:
            break;
    }
  }

  private static consumeViaRabbitmq(jobQueue:any = null) {
    let queue = jobQueue;
    const amqp = require("amqplib/callback_api");
    try {
      amqp.connect(
        `${Config.connections[Config.default].host}:${Config.connections[Config.default].port}`, (error: any, connect: { createChannel: (arg0: (channelError: any, channel: any) => void) => void; }) => {
          if (error) throw error;
          if (queue == null) queue = Config.connections[Config.default].queue;
          connect.createChannel((channelError: { message: any; }, channel: { assertQueue: (arg0: any) => void; consume: (arg0: any, arg1: (msg: any) => void) => void; ack: (arg0: any) => void; }) => {
            if (channelError) BaseCommand.error(channelError.message);
            channel.assertQueue(queue);
            BaseCommand.success(`[*] Waiting for messages in ${queue} queue. To exit press CTRL+C`)
            channel.consume(queue, (msg: { content: { toString: () => string; }; }) => {
              BaseCommand.success(`Received ${msg.content.toString()}`);
              let data = JSON.parse(msg.content.toString());
              this.callHandlers(data);
              channel.ack(msg);
            });
          })
        });
    } catch (error) {
      BaseCommand.error(error.message)
    }
  }

  private static callHandlers(msg:any = null) {
    FS.readdirSync(`${__dirname}/../../../../App/Jobs/`).forEach(async(file) => {
      await import(`${__dirname}/../../../../App/Jobs/${file}`).then((f) => {
        let jobObject = f.default;
        let job = new jobObject();
        if (job.signature == msg.signature) {
          try {
            job.handle(msg.data);
          } catch (e) {
            console.log(e);
          }
        }
      });
    });
  }
}

export default QueueWorkerProgram;
