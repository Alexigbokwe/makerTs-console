"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const baseCommand_1 = tslib_1.__importDefault(require("../baseCommand"));
class JobProgram {
    static async handle(name) {
        name = name[0].toUpperCase() + name.slice(1);
        let checkFolder = baseCommand_1.default.checkFolderExists("./App/Jobs");
        if (checkFolder) {
            let doesFileExist = await baseCommand_1.default.checkFileExists("./App/Jobs/" + name + "_job.ts");
            if (doesFileExist == false) {
                await this.nextStep(name);
            }
            else {
                return baseCommand_1.default.error(name + "_job.ts already exist. Modify job name and try again");
            }
        }
    }
    static async nextStep(name) {
        fs_1.default.appendFile("./App/Jobs/" + name + "_job.ts", this.generateJob(name), function (err) {
            if (err)
                return baseCommand_1.default.error(err.errno);
            baseCommand_1.default.success(name + "_job.ts class successfully generated in App/Jobs folder");
            return true;
        });
    }
    static generateJob(name) {
        let body = `"use strict";
        const ShouldQueue = require("../../Bootstrap/Queue/ShouldQueue");

        class ${name} extends ShouldQueue{
          constructor() {
            super();
            this.signature = "${name}_job";
            this.queueSignature(this.signature);
          }
          /**
           * Execute the job.
           * @return void
           */
          handle(data) {
            //
          }
        }

        export default ${name};`;
        return body;
    }
}
exports.default = JobProgram;