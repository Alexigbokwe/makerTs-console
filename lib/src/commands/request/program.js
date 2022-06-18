"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const baseCommand_1 = __importDefault(require("../baseCommand"));
class RequestProgram {
    static async handle(name) {
        name = name[0].toUpperCase() + name.slice(1);
        let checkFolder = baseCommand_1.default.checkFolderExists("./App/Http/Validation");
        if (checkFolder) {
            let doesFileExist = await baseCommand_1.default.checkFileExists("./App/Http/Validation/" + name + "Validation.ts");
            if (doesFileExist == false) {
                await this.nextStep(name);
            }
            else {
                return baseCommand_1.default.error(name + "Validation.ts already exist. Modify request validator name and try again");
            }
        }
    }
    static async nextStep(name) {
        name = name.includes("validation") ? name : name + "Validation";
        const validationName = name.charAt(0).toUpperCase() + name.slice(1);
        fs_1.default.appendFile("./App/Http/Validation/" + validationName + ".ts", this.generateRequest(validationName), function (err) {
            if (err)
                return baseCommand_1.default.error(err.errno);
            baseCommand_1.default.success(validationName + "Validation.ts class successfully generated in App/Http/Validation folder");
            return true;
        });
    }
    static generateRequest(name) {
        let body = `"use strict";
    import FormRequest from "Elucidate/Validator/FormRequest";

    class ${name} extends FormRequest{
      /**
       * Handle the request validation.
       * @param {*} data | e.g request body
       */
      async validate<T>(data:T) {
        return await FormRequest.make<T>(data, {
          //Validation rules
        });
      }
    }

    export default new ${name}();`;
        return body;
    }
}
exports.default = RequestProgram;
