"use strict";
import BaseCommand from "../baseCommand";
require("dotenv").config();
let configQueuePath = "";
let jobDirectories = "";
let tsRPC_ConsumerDirectories = "";

if (process.env.APP_ENV == "local" || process.env.APP_ENV == "development" || process.env.APP_ENV == "test") {
  configQueuePath = `${__dirname}/../../../../../../Config/queue`;
  jobDirectories = `${__dirname}/../../../../../../App/Jobs`;
  tsRPC_ConsumerDirectories = `${__dirname}/../../../../../../App/RPC_Consumer`;
} else if (process.env.APP_ENV == "production" || process.env.APP_ENV == "staging") {
  configQueuePath = `${__dirname}/../../../../../../build/Config/queue`;
  jobDirectories = `${__dirname}/../../../../../../build/App/Jobs`;
  tsRPC_ConsumerDirectories = `${__dirname}/../../../../../../build/App/RPC_Consumer`;
}

enum queueProviders {
  Bull = "bull",
  BullMQ = "bullmq",
  RABBITMQ = "rabbitmq",
}

//@ts-ignore
import FS from "fs";

class QueueWorkerProgram {
  static async handle(name: string) {
    await import(configQueuePath).then((file) => {
      const Config: any = Object.values(file)[0];
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
    } catch (error: any) {
      BaseCommand.error(error.message);
    }
  }

  private static processBullMQueue(queue: string, Config: any) {
    const { Worker } = require("bullmq");
    BaseCommand.success(`[*] Waiting for messages in ${queue} queue. To exit press CTRL+C`);

    new Worker(
      queue,
      async (job: any) => {
        BaseCommand.success("Data Received");
        return this.callJobHandlers({
          data: job.data,
          signature: job.name,
        });
      },
      { connection: { port: Config.connections[Config.default].port, host: Config.connections[Config.default].host, password: Config.connections[Config.default].password } }
    );
  }

  private static processBullQueue(queue: string, Config: any) {
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

  private static async callJobHandlers(msg: any = null) {
    let error: any = null;
    const files = FS.readdirSync(`${jobDirectories}/`);
    for await (let file of files) {
      await import(`${jobDirectories}/${file}`).then((f) => {
        const jobObject: any = Object.values(f)[0];
        let job = new jobObject();
        if (job.signature == msg.signature) {
          try {
            let methods = this.getAllMethodsInClass(job);
            if (methods.includes("handle")) {
              job.handle(msg.data);
            }
          } catch (e) {
            console.log(e);
          }
        }
      });
    }

    if (error) {
      throw new Error(error?.message);
    }
  }

  private static getAllMethodsInClass(value: any) {
    let props: any[] = [];
    let obj = value;
    do {
      props = props.concat(Object.getOwnPropertyNames(obj));
    } while ((obj = Object.getPrototypeOf(obj)));

    return props.sort().filter((e, i, arr) => {
      if (e != arr[i + 1] && typeof value[e] == "function") return true;
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
