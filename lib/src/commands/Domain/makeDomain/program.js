"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ora_1 = __importDefault(require("ora"));
const fs_1 = __importDefault(require("fs"));
const baseCommand_1 = __importDefault(require("../../baseCommand"));
const shelljs_1 = __importDefault(require("shelljs"));
const spinner = ora_1.default("Processing: ");
const program_1 = __importDefault(require("../../controller/program"));
const program_2 = __importDefault(require("../../route/program"));
const program_3 = __importDefault(require("../../sqlModel/program"));
const program_4 = __importDefault(require("../../nosqlModel/program"));
const program_5 = __importDefault(require("../../makeService/program"));
class MakeDomainProgram {
    static async handle(name) {
        spinner.start();
        spinner.color = "magenta";
        spinner.text = "Generating Domain";
        name = name[0].toUpperCase() + name.slice(1);
        let checkFolder = baseCommand_1.default.checkFolderExists("./Domains");
        if (checkFolder) {
            let createDomainParentFolder = baseCommand_1.default.checkFolderExists(`./Domains/${name}`);
            if (createDomainParentFolder) {
                await this.nextStep(name);
            }
            else {
                return baseCommand_1.default.error(`${name} domain already exist. Modify domain name and try again`);
            }
        }
    }
    static async nextStep(name) {
        await this.domainFolders(name)
            .then(() => {
            baseCommand_1.default.success(`${name} Domain Successfully Generated`);
        })
            .catch((error) => {
            baseCommand_1.default.success(`Error Occured  While  Generating ${name} Domain: ${error}`);
        });
    }
    static async domainFolders(name) {
        let blockPath = `./Domains/${name}`;
        await this.httpFolders(blockPath, name);
        await this.routeFolder(blockPath, name);
        await this.modelFolder(blockPath, name);
        await this.serviceFolder(blockPath, name);
        await this.RepositoryFolder(blockPath);
        await this.TestsFolder(blockPath);
    }
    static async RepositoryFolder(path) {
        shelljs_1.default.mkdir(`${path}/Repository`);
    }
    static async TestsFolder(path) {
        shelljs_1.default.mkdir(`${path}/Tests`);
    }
    static async httpFolders(path, name) {
        shelljs_1.default.mkdir(`${path}/Http`);
        let blockPath = `${path}/Http`;
        await this.domainController(blockPath, name);
    }
    static async domainController(path, name) {
        shelljs_1.default.mkdir(`${path}/Controller`);
        fs_1.default.appendFile(`${path}/${name}Controller.ts`, await program_1.default.controllerBodyWithResource(name), function (err) {
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
    static async modelFolder(path, name) {
        shelljs_1.default.mkdir(`${path}/Model`);
        fs_1.default.appendFile(`${path}/Model/${name}_model.ts`, this.modelBody(name), function (err) {
            if (err)
                throw err;
            baseCommand_1.default.success(`${name} model successfully generated in Domains/${name}/Model directory`);
        });
    }
    static modelBody(name) {
        if (process.env.DB_CONNECTION != "mongoose") {
            return program_3.default.modelBody(name);
        }
        else {
            return program_4.default.generateModel(name);
        }
    }
    static async serviceFolder(path, name) {
        shelljs_1.default.mkdir(`${path}/Service`);
        let servicePath = `${path}/Service`;
        await this.loadInterface(servicePath, name);
        await this.loadService(servicePath, name);
    }
    static loadInterface(servicePath, name) {
        fs_1.default.appendFile(`${servicePath}/I${name}Service.ts`, program_5.default.generateServiceInterface(name), function (err) {
            if (err)
                throw err;
            baseCommand_1.default.success(`I${name}Service.ts interface successfully generated in Domains/${name}/Service directory`);
        });
    }
    static loadService(servicePath, name) {
        fs_1.default.appendFile(`${servicePath}/index.ts`, program_5.default.generateService(name), function (err) {
            if (err)
                throw err;
            baseCommand_1.default.success(`${name}Service implementation class successfully generated in Domains/${name}/Service directory`);
        });
    }
}
exports.default = MakeDomainProgram;
