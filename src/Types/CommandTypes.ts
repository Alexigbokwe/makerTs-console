import { CommandArgument, CommandOption } from "../command";

export enum mode {
  REQUIRED = "REQUIRED",
  OPTIONAL = "OPTIONAL",
}

export type TCommand = {
  signature: string;
  arguments?: CommandArgument[];
  options?: CommandOption[];
  description: string;
  fire(...args: any): any;
  validateOptions(): void;
  getHelpText(): string;
};

export enum ORM {
  Objection = "Objection",
  Mongoose = "Mongoose",
  TypeORM = "TypeORM",
}

export enum Arguments {
  migration = "m",
  broker = "b",
  resourceController = "r",
}
