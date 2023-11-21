"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ora_1 = __importDefault(require("ora"));
const fs_1 = __importDefault(require("fs"));
const baseCommand_1 = __importDefault(require("../../baseCommand"));
const shelljs_1 = __importDefault(require("shelljs"));
const spinner = (0, ora_1.default)("Processing: ");
const program_1 = __importDefault(require("../../controller/program"));
const program_2 = __importDefault(require("../../route/program"));
const program_3 = __importDefault(require("../../sqlModel/program"));
const program_4 = __importDefault(require("../../nosqlModel/program"));
const program_5 = __importDefault(require("../../makeService/program"));
const CommandTypes_1 = require("../../../Types/CommandTypes");
class MakeDomainProgram {
    static async handle(name, orm) {
        spinner.start();
        spinner.color = "magenta";
        spinner.text = "Generating Domain";
        name = name[0].toUpperCase() + name.slice(1);
        try {
            this.createDirectory("./Domains");
            if (!this.createDirectory("./Domains/" + name)) {
                throw new Error(name + " domain already exist");
            }
            else {
                await this.nextStep(name, orm);
                spinner.color = "green";
                spinner.text = "Completed";
                spinner.succeed(name + " domain successfully generated.");
            }
        }
        catch (error) {
            spinner.color = "red";
            spinner.text = "failed";
            spinner.fail("");
            baseCommand_1.default.error(error);
        }
    }
    static createDirectory(name) {
        if (!fs_1.default.existsSync(name)) {
            fs_1.default.mkdirSync(name);
            return true;
        }
        else {
            return false;
        }
    }
    static async nextStep(name, orm) {
        await this.domainFolders(name, orm)
            .then(() => {
            baseCommand_1.default.success(`${name} Domain Successfully Generated`);
        })
            .catch((error) => {
            baseCommand_1.default.success(`Error Occurred  While  Generating ${name} Domain: ${error}`);
        });
    }
    static async domainFolders(name, orm) {
        let blockPath = `./Domains/${name}`;
        await this.httpFolders(blockPath, name);
        await this.routeFolder(blockPath, name);
        await this.modelFolder(blockPath, name, orm);
        await this.serviceFolder(blockPath, name);
        await this.serviceProviderFolder(blockPath, name);
        await this.RepositoryFolder(blockPath);
        await this.TestsFolder(blockPath);
    }
    static async RepositoryFolder(path) {
        shelljs_1.default.mkdir(`${path}/Repository`);
    }
    static async TestsFolder(path) {
        shelljs_1.default.mkdir(`${path}/Tests`);
    }
    static async ValidationFolder(path) {
        shelljs_1.default.mkdir(`${path}/Validation`);
    }
    static async httpFolders(path, name) {
        this.createDirectory(`${path}/Http`);
        let blockPath = `${path}/Http`;
        await this.ValidationFolder(blockPath);
        await this.domainController(blockPath, name);
    }
    static async domainController(path, name) {
        this.createDirectory(`${path}/Controller`);
        fs_1.default.appendFile(`${path}/Controller/${name}Controller.ts`, await program_1.default.controllerBodyWithResource(`${name}Controller`), function (err) {
            if (err)
                throw err;
            baseCommand_1.default.success(`${name} controller successfully generated in Domains/${name}/Http/Controller directory`);
        });
    }
    static async routeFolder(path, name) {
        shelljs_1.default.mkdir(`${path}/Routes`);
        fs_1.default.appendFile(`${path}/Routes/index.ts`, await program_2.default.routeBody(name), function (err) {
            if (err)
                throw err;
            baseCommand_1.default.success(`${name} route successfully generated in Domains/${name}/Routes directory`);
        });
    }
    static async modelFolder(path, name, orm) {
        shelljs_1.default.mkdir(`${path}/Model`);
        fs_1.default.appendFile(`${path}/Model/${name}Model.ts`, this.modelBody(name, orm), function (err) {
            if (err)
                throw err;
            baseCommand_1.default.success(`${name} model successfully generated in Domains/${name}/Model directory`);
        });
    }
    static modelBody(name, orm) {
        if (orm !== CommandTypes_1.ORM.Mongoose) {
            return program_3.default.modelBody(name, orm);
        }
        else {
            return program_4.default.generateModel(name);
        }
    }
    static serviceProviderFolder(path, name) {
        shelljs_1.default.mkdir(`${path}/Provider`);
        let providerPath = `${path}/Provider`;
        fs_1.default.appendFile(`${providerPath}/${name}ServiceProvider.ts`, this.providerBody(name), function (err) {
            if (err)
                throw err;
            baseCommand_1.default.success(`${name}ServiceProvider.ts successfully generated in Domains/${name}/Provider directory`);
        });
    }
    static providerBody(name) {
        name = `${name}ServiceProvider`;
        let body = `
      import {ServiceProvider} from "Elucidate/Support/ServiceProvider";

      export class ${name} extends ServiceProvider{
        /**
         * Register any application services.
         * @return void
         */
        public register():void {
          //
        }

        /**
         * Bootstrap any application services.
         * @return void
         */
        public async boot():Promise<void> {
          //
        }
      
        /**
         * Load any service after application boot stage
         * @return void
         */
        public async booted():Promise<void> {
          //
        }
      }`;
        return body;
    }
    static async serviceFolder(path, name) {
        shelljs_1.default.mkdir(`${path}/Service`);
        let servicePath = `${path}/Service`;
        this.loadAbstractService(servicePath, name);
        this.loadService(servicePath, name);
    }
    static loadAbstractService(servicePath, name) {
        fs_1.default.appendFile(`${servicePath}/${name}Service.ts`, program_5.default.generateServiceAbstractClass(name), function (err) {
            if (err)
                throw err;
            baseCommand_1.default.success(`${name}Service.ts abstract class successfully generated in Domains/${name}/Service directory`);
        });
    }
    static loadService(servicePath, name) {
        fs_1.default.appendFile(`${servicePath}/${name}ServiceImpl.ts`, program_5.default.generateService(name, false), function (err) {
            if (err)
                throw err;
            baseCommand_1.default.success(`${name}ServiceImpl implementation class successfully generated in Domains/${name}/Service directory`);
        });
    }
}
exports.default = MakeDomainProgram;
