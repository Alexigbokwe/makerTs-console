"use strict";
import fs from "fs";
import BaseCommand from "../baseCommand";

class RequestProgram {
  static async handle(name: string) {
    name = name[0].toUpperCase() + name.slice(1);
    let checkFolder = BaseCommand.checkFolderExists("./App/Http/Requests");
    if (checkFolder) {
      let doesFileExist = await BaseCommand.checkFileExists("./App/Http/Requests/" + name + "_request.ts");
      if (doesFileExist == false) {
        await this.nextStep(name);
      } else {
        return BaseCommand.error(name + "_request.ts already exist. Modify request validator name and try again");
      }
    }
  }

  private static async nextStep(name: string) {
    name = name.includes("validation") ? name : name + "Validation";
    const validationName = name.charAt(0).toUpperCase() + name.slice(1);
    fs.appendFile("./App/Http/Requests/" + validationName + ".ts", this.generateRequest(validationName), function (err: any) {
      if (err) return BaseCommand.error(err.errno);
      BaseCommand.success(validationName + "_validation.ts class successfully generated in App/Http/Requests folder");
      return true;
    });
  }

  private static generateRequest(name: string) {
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

export default RequestProgram;
