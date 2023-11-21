export enum mode {
  REQUIRED = "REQUIRED",
  OPTIONAL = "OPTIONAL",
}

export type TCommand = {
  signature: string;
  arguments: { name: string; mode: mode }[];
  description: string;
  fire(...args: any): any;
};

export enum ORM {
  Objection = "Objection",
  Mongoose = "Mongoose",
  TypeORM = "TypeORM",
}
