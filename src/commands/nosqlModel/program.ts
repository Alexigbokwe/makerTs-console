"use strict";
import fs from "fs";
import BaseCommand from "../baseCommand";

class NoSqlProgram {
  static async handle(name: string) {
    name = name[0].toUpperCase() + name.slice(1);
    let checkFolder = BaseCommand.checkFolderExists("./App/Model");
    if (checkFolder) {
      let doesFileExist = await BaseCommand.checkFileExists("./App/Model/" + name + "Model.ts");
      if (doesFileExist == false) {
        await this.nextStep(name);
      } else {
        return BaseCommand.error(name + "Model.ts already exist. Modify model name and try again");
      }
    }
  }

  private static async nextStep(name: string) {
    fs.appendFile("./App/Model/" + name + "Model.ts", this.generateModel(name), function (err) {
      if (err) return BaseCommand.error(err.errno);
      BaseCommand.success(name + "Model.ts class successfully generated in App/Model folder");
      return true;
    });
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

export default NoSqlProgram;
