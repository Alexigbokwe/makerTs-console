"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ora_1 = __importDefault(require("ora"));
const fs_1 = __importDefault(require("fs"));
const baseCommand_1 = __importDefault(require("../baseCommand"));
const spinner = ora_1.default("Processing: ");
class WsControllerProgram {
    static async handle(name) {
        name = name[0].toUpperCase() + name.slice(1);
        let check = await baseCommand_1.default.checkFileExists("./App/Http/Controller/Ws/" + name + ".ts");
        if (check == false) {
            this.nextStep(name);
        }
        else {
            return baseCommand_1.default.error(`${name} web socket controller class already exists`);
        }
    }
    static nextStep(name) {
        spinner.start();
        spinner.color = "magenta";
        spinner.text = "Generating Web Socket Controller Class";
        fs_1.default.appendFile("./App/Http/Controller/Ws/" + name + ".ts", this.generateController(name), function (err) {
            if (err)
                return baseCommand_1.default.error(err.errno);
            baseCommand_1.default.success("\n" +
                name +
                ".ts web socket class successfully generated in App/Http/Controller/Ws folder");
            spinner.color = "green";
            spinner.text = "Completed";
            spinner.succeed("Done 😊😘");
            return true;
        });
    }
    static generateController(name) {
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
exports.default = WsControllerProgram;
