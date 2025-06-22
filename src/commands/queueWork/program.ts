"use strict";
import { projectDirectory } from "../../RootDirectory";
import BaseCommand from "../baseCommand";
import { promises as fs } from "fs";
import path from "path";
import * as dotenv from "dotenv";

dotenv.config();

const configQueuePath = path.join(projectDirectory, "Config", "Queue");
const jobDirectories = path.join(projectDirectory, "App", "Jobs");

enum QueueProviders {
  Bull = "bull",
  BullMQ = "bullmq",
  RabbitMQ = "rabbitmq",
}

export class QueueWorkerProgram {
  static async handle(name: string) {
    try {
      const { default: Config } = await import(configQueuePath);
      const connectionConfig = Config.connections[Config.default];
      const queueName = name || connectionConfig.queue;

      switch (Config.default) {
        case "rabbitmq":
          this.consumeViaRabbitmq(queueName, connectionConfig);
          break;
        case "redis":
          this.consumeViaRedis(queueName, connectionConfig);
          break;
        default:
          throw new Error(`Unsupported queue driver: ${Config.default}`);
      }
    } catch (error) {
      BaseCommand.error((error as Error).message);
    }
  }

  private static consumeViaRedis(queue: string, config: any) {
    switch (config.provider_name) {
      case QueueProviders.Bull:
        this.processBullQueue(queue, config);
        break;
      case QueueProviders.BullMQ:
        this.processBullMQueue(queue, config);
        break;
      default:
        throw new Error("Invalid redis provider name");
    }
  }

  private static processBullMQueue(queue: string, config: any) {
    const { Worker } = require("bullmq");
    BaseCommand.success(`[*] Waiting for messages in ${queue} queue. To exit press CTRL+C`);

    new Worker(
      queue,
      (job: any) => {
        BaseCommand.success(`Received job: ${job.name}`);
        return this.callJobHandlers({ data: job.data, signature: job.name });
      },
      { connection: { port: config.port, host: config.host, password: config.password } }
    );
  }

  private static processBullQueue(queue: string, config: any) {
    const Bull = require("bull");
    const connection = new Bull(queue, { redis: { port: config.port, host: config.host, password: config.password } });
    BaseCommand.success(`[*] Waiting for messages in ${queue} queue. To exit press CTRL+C`);
    connection.process(async (job: any, done: any) => {
      try {
        BaseCommand.success(`Received job: ${job.name}`);
        await this.callJobHandlers(job.data);
        done();
      } catch (error) {
        BaseCommand.error((error as Error).message);
        done(error);
      }
    });
  }

  private static consumeViaRabbitmq(queue: string, config: any) {
    const amqp = require("amqplib/callback_api");
    amqp.connect(`${config.host}:${config.port}`, (error: any, connection: any) => {
      if (error) throw error;
      connection.createChannel((channelError: any, channel: any) => {
        if (channelError) throw channelError;
        channel.assertQueue(queue);
        BaseCommand.success(`[*] Waiting for messages in ${queue} queue. To exit press CTRL+C`);
        channel.consume(queue, async (msg: any) => {
          if (msg !== null) {
            try {
              BaseCommand.success(`Received ${msg.content.toString()}`);
              const data = JSON.parse(msg.content.toString());
              await this.callJobHandlers(data);
              channel.ack(msg);
            } catch (error) {
              BaseCommand.error((error as Error).message);
              channel.nack(msg);
            }
          }
        });
      });
    });
  }

  private static async callJobHandlers(msg: any) {
    try {
      const files = await fs.readdir(jobDirectories);
      for (const file of files) {
        if (path.extname(file) === ".ts" || path.extname(file) === ".js") {
          const { default: Job } = await import(path.join(jobDirectories, file));
          const jobInstance = new Job();
          if (jobInstance.signature === msg.signature) {
            await jobInstance.handle(msg.data);
            return;
          }
        }
      }
      throw new Error(`Job with signature ${msg.signature} not found.`);
    } catch (error) {
      BaseCommand.error(`Job handler error: ${(error as Error).message}`);
    }
  }
}
