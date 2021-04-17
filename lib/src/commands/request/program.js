"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const baseCommand_1 = tslib_1.__importDefault(require("../baseCommand"));
class RequestProgram {
    static async handle(name) {
        name = name[0].toUpperCase() + name.slice(1);
        let checkFolder = baseCommand_1.default.checkFolderExists("./App/Http/Requests");
        if (checkFolder) {
            let doesFileExist = await baseCommand_1.default.checkFileExists("./App/Http/Requests/" + name + "_request.ts");
            if (doesFileExist == false) {
                await this.nextStep(name);
            }
            else {
                return baseCommand_1.default.error(name +
                    "_request.ts already exist. Modify request validator name and try again");
            }
        }
    }
    static async nextStep(name) {
        fs_1.default.appendFile("./App/Http/Requests/" + name + "_request.ts", this.generateRequest(name), function (err) {
            if (err)
                return baseCommand_1.default.error(err.errno);
            baseCommand_1.default.success(name +
                "_request.ts class successfully generated in App/Http/Requests folder");
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
      async validate(data) {
        return await this.make(data, {
          //Validation rules
        });
      }
    }

    export default new ${name}();`;
        return body;
    }
}
exports.default = RequestProgram;