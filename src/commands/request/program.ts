"use strict";
import fs from "fs";
import BaseCommand from "../baseCommand";

class RequestProgram {
  static async handle(name:string) {
    name = name[0].toUpperCase() + name.slice(1);
    let checkFolder = BaseCommand.checkFolderExists("./App/Http/Requests");
    if (checkFolder) {
      let doesFileExist = await BaseCommand.checkFileExists(
        "./App/Http/Requests/" + name + "_request.ts",
      );
      if (doesFileExist == false) {
        await this.nextStep(name);
      } else {
        return BaseCommand.error(
          name +
            "_request.ts already exist. Modify request validator name and try again",
        );
      }
    }
  }

  private static async nextStep(name:string) {
    fs.appendFile(
      "./App/Http/Requests/" + name + "_request.ts",
      this.generateRequest(name),
      function (err:any) {
        if (err) return BaseCommand.error(err.errno);
        BaseCommand.success(
          name +
            "_request.ts class successfully generated in App/Http/Requests folder",
        );
        return true;
      },
    );
  }

  private static generateRequest(name:string) {
    let body = `"use strict";
    import FormRequest from "Elucidate/Validator/FormRequest";

    class ${name}{
      /**
       * Handle the request validation.
       * @param {*} data | e.g request body
       */
      async validate<T>(data:T) {
        return await FormRequest.make(data, {
          //Validation rules
        });
      }
    }

    export default new ${name}();`;
    return body;
  }
}

export default RequestProgram;
