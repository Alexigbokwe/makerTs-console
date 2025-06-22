"use strict";
import { promises as fs } from "fs";
import BaseCommand from "../baseCommand";
import path from "path";

export class NoSqlProgram {
  static async handle(name: string) {
    name = name[0].toUpperCase() + name.slice(1);
    const modelName = `${name}Model`;
    const modelPath = path.join("App", "Model");
    const filePath = path.join(modelPath, `${modelName}.ts`);

    if (await BaseCommand.checkFileExists(filePath)) {
      return BaseCommand.error(`${modelName}.ts already exists. Modify model name and try again`);
    }

    if (await BaseCommand.checkFolderExists(modelPath)) {
      await this.nextStep(modelName, filePath, name);
    }
  }

  private static async nextStep(modelName: string, filePath: string, name: string) {
    try {
      await fs.writeFile(filePath, this.generateModel(name));
      BaseCommand.success(`${modelName}.ts class successfully generated in App/Model folder`);
    } catch (err) {
      BaseCommand.error((err as Error).message);
    }
  }

  static generateModel(name: string) {
    let body = `
    import mongoose,{Schema } from "mongoose";

    export interface ${name}Interface extends Document {
      //
    }

    const ${name}Schema: Schema = new Schema({
      //define the shape of your document within the collection.
    });

    const ${name} = mongoose.model<${name}Interface>("${name}", ${name}Schema);
    export default ${name};`;
    return body;
  }
}
