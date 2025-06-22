"use strict";
import { promises as fs } from "fs";
import BaseCommand from "../baseCommand";
import path from "path";

export class WsControllerProgram {
  static async handle(name: string) {
    const spinner = BaseCommand.progress();
    name = name[0].toUpperCase() + name.slice(1);
    const controllerPath = path.join("App", "Http", "Controller", "Ws");
    const filePath = path.join(controllerPath, `${name}.ts`);

    spinner.start(`Generating web socket controller ${name}`);

    try {
      if (await BaseCommand.checkFileExists(filePath)) {
        throw new Error(`${name} web socket controller class already exists`);
      }

      await BaseCommand.checkFolderExists(controllerPath);
      await this.nextStep(name, filePath);
      spinner.succeed(`Web socket controller ${name} created successfully.`);
    } catch (error) {
      spinner.fail((error as Error).message);
    }
  }

  private static async nextStep(name: string, filePath: string) {
    await fs.writeFile(filePath, this.generateController(name));
    BaseCommand.success(`${name}.ts web socket class successfully generated in App/Http/Controller/Ws folder`);
  }

  private static generateController(name: string) {
    let body = `

    class ${name}{
      protected socket:any;
      constructor(socket:any) {
        this.socket = socket;
        this.setMethodListeners();
      }

      onMessage = (data:any) => {
        // same as: socket.on('message')
        this.socket.on('message');
        console.log(data);
      }

      onClose = (data:any) =>{
        // same as: socket.on('close')
        console.log(data);
      }

      onError = (data:any) =>{
        // same as: socket.on('error')
        console.log(data);
      }

      private setMethodListeners() {
        this.socket.on("message", this.onMessage);
        this.socket.on("close", this.onClose);
        this.socket.on("error", this.onError);
      }
    }

    export default ${name};`;
    return body;
  }
}
