"use strict";
import Ora from "ora";
import fs from "fs";
import BaseCommand from "../baseCommand";
const spinner = Ora("Processing: ");

class WsControllerProgram {
  static async handle(name: string) {
    name = name[0].toUpperCase() + name.slice(1);
    let check = await BaseCommand.checkFileExists(
      "./App/Http/Controller/Ws/" + name + ".ts",
    );
    if (check == false) {
      this.nextStep(name);
    } else {
      return BaseCommand.error(
        `${name} web socket controller class already exists`,
      );
    }
  }

  private static nextStep(name: string) {
    spinner.start();
    spinner.color = "magenta";
    spinner.text = "Generating Web Socket Controller Class";
    fs.appendFile(
      "./App/Http/Controller/Ws/" + name + ".ts",
      this.generateController(name),
      function (err) {
        if (err) return BaseCommand.error(err.errno);
        BaseCommand.success(
          "\n" +
            name +
            ".ts web socket class successfully generated in App/Http/Controller/Ws folder",
        );
        spinner.color = "green";
        spinner.text = "Completed";
        spinner.succeed("Done 😊😘");
        return true;
      },
    );
  }

  private static generateController(name: string) {
    let body = `"use strict";
    import WsBaseController from "Elucidate/Socket/src/Base";

    class ${name} extends WsBaseController {
      protected socket:any;
      constructor(socket:any) {
        super(socket);
        this.socket = socket;
      }

      onMessage<T>(data:T) {
        // same as: socket.on('message')
        this.socket.on('message');
        console.log(data);
      }

      onClose<T>() {
        // same as: socket.on('close')
      }

      onError<T>() {
        // same as: socket.on('error')
      }
    }

    export default ${name};`;
    return body;
  }
}

export default WsControllerProgram;
