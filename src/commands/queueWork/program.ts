"use strict";
import BaseCommand from "../baseCommand";
require('dotenv').config();
import path from "path";
import shell from "shelljs";
let configQueuePath = path + "../../../../../build/Config/queue";
let tsJobDirectories = `${__dirname}/../../../../../../App/Jobs`;
let jsJobDirectories = `${__dirname}/../../../../../../build/App/Jobs`;
//@ts-ignore
import FS from "fs";

class QueueWorkerProgram {
  static async handle(name: string) {
    this.buildFile();
    await import(configQueuePath).then(file => {
      let Config = file.default;
      switch (Config.default) {
        case "rabbitmq":
            this.consumeViaRabbitmq(name,Config); 
            break;
        default:
            break;
    }
    })
  }

  private static buildFile() {
    if (shell.exec("tsc -p .").code !== 0) {
      shell.echo("Error: Build project command failed");
      shell.exit(1);
    }
  }

  private static consumeViaRabbitmq(jobQueue:any = null,Config:any) {
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
    FS.readdirSync(`${tsJobDirectories}/`).forEach(async (file) => {
      let filename = file.split(".");
      await import(`${jsJobDirectories}/${filename[0]}.js`).then((f) => {
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
