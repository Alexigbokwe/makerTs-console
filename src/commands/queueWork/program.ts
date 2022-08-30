"use strict";
import BaseCommand from "../baseCommand";
require("dotenv").config();
let configQueuePath = "";
let tsJobDirectories = "";
let tsRPC_ConsumerDirectories = "";

if (process.env.APP_ENV == "local" || process.env.APP_ENV == "development" || process.env.APP_ENV == "test") {
  configQueuePath = `${__dirname}/../../../../../../Config/queue`;
  tsJobDirectories = `${__dirname}/../../../../../../App/Jobs`;
  tsRPC_ConsumerDirectories = `${__dirname}/../../../../../../App/RPC_Consumer`;
} else if (process.env.APP_ENV == "production" || process.env.APP_ENV == "staging") {
  configQueuePath = `${__dirname}/../../../../../../build/Config/queue`;
  tsJobDirectories = `${__dirname}/../../../../../../build/App/Jobs`;
  tsRPC_ConsumerDirectories = `${__dirname}/../../../../../../build/App/RPC_Consumer`;
}

//@ts-ignore
import FS from "fs";

class QueueWorkerProgram {
  static async handle(name: string) {
    await import(configQueuePath).then((file) => {
      let Config = file.default;
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

  private static consumeViaRedis(jobQueue: any = null, Config: any) {
    try {
      let queue = jobQueue;
      if (queue == null) queue = Config.connections[Config.default].queue;
      const job = require("bull");

      let connection = new job(queue, { redis: { port: Config.connections[Config.default].port, host: Config.connections[Config.default].host, password: Config.connections[Config.default].password } });
      BaseCommand.success(`[*] Waiting for messages in ${queue} queue. To exit press CTRL+C`);

      connection.process((job: any, done: any) => {
        job.progress("fetching data");
        let data = job.data;
        job.progress("fetched data");
        BaseCommand.success("Data Received");
        job.progress("Processing job");
        this.callJobHandlers(data);
        job.progress("Done processing job");
        done();
      });
    } catch (error: any) {
      BaseCommand.error(error.message);
    }
  }

  private static consumeViaRabbitmq(jobQueue: any = null, Config: any) {
    let queue = jobQueue;
    const amqp = require("amqplib/callback_api");
    try {
      amqp.connect(`${Config.connections[Config.default].host}:${Config.connections[Config.default].port}`, (error: any, connect: { createChannel: (arg0: (channelError: any, channel: any) => void) => void }) => {
        if (error) throw error;
        if (queue == null) queue = Config.connections[Config.default].queue;
        connect.createChannel((channelError: { message: any }, channel: { assertQueue: (arg0: any) => void; consume: (arg0: any, arg1: (msg: any) => void) => void; ack: (arg0: any) => void }) => {
          if (channelError) BaseCommand.error(channelError.message);
          channel.assertQueue(queue);
          BaseCommand.success(`[*] Waiting for messages in ${queue} queue. To exit press CTRL+C`);
          channel.consume(queue, (msg: { content: { toString: () => string } }) => {
            BaseCommand.success(`Received ${msg.content.toString()}`);
            let data = JSON.parse(msg.content.toString());
            this.callJobHandlers(data);
            channel.ack(msg);
          });
        });
      });
    } catch (error: any) {
      BaseCommand.error(error.message);
    }
  }

  private static callJobHandlers(msg: any = null) {
    FS.readdirSync(`${tsJobDirectories}/`).forEach(async (file) => {
      await import(`${tsJobDirectories}/${file}`).then((f) => {
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

  // private static callRPCHandlers(msg: any = null) {
  //   FS.readdirSync(`${tsRPC_ConsumerDirectories}/`).forEach(async (file) => {
  //     await import(`${tsRPC_ConsumerDirectories}/${file}`).then((f) => {
  //       let RPC_Consumer = f.default;
  //       let RPC = new RPC_Consumer();
  //       try {
  //         RPC.handle(msg.data);
  //       } catch (e) {
  //         console.log(e);
  //       }
  //     });
  //   });
  // }
}

export default QueueWorkerProgram;
