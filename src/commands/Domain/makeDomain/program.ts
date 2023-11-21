"use strict";
import Ora from "ora";
import fs from "fs";
import BaseCommand from "../../baseCommand";
import shell from "shelljs";
const spinner = Ora("Processing: ");
import controller from "../../controller/program";
import route from "../../route/program";
import SqlProgram from "../../sqlModel/program";
import NoSqlProgram from "../../nosqlModel/program";
import serviceProgram from "../../makeService/program";
import { ORM } from "../../../Types/CommandTypes";

class MakeDomainProgram {
  static async handle(name: string, orm: ORM) {
    spinner.start();
    spinner.color = "magenta";
    spinner.text = "Generating Domain";
    name = name[0].toUpperCase() + name.slice(1);

    try {
      this.createDirectory("./Domains");
      if (!this.createDirectory("./Domains/" + name)) {
        throw new Error(name + " domain already exist");
      } else {
        await this.nextStep(name, orm);
        spinner.color = "green";
        spinner.text = "Completed";
        spinner.succeed(name + " domain successfully generated.");
      }
    } catch (error) {
      spinner.color = "red";
      spinner.text = "failed";
      spinner.fail("");
      BaseCommand.error(error);
    }
  }

  private static createDirectory(name: string) {
    if (!fs.existsSync(name)) {
      fs.mkdirSync(name);
      return true;
    } else {
      return false;
    }
  }

  private static async nextStep(name: string, orm: ORM) {
    await this.domainFolders(name, orm)
      .then(() => {
        BaseCommand.success(`${name} Domain Successfully Generated`);
      })
      .catch((error) => {
        BaseCommand.success(`Error Occurred  While  Generating ${name} Domain: ${error}`);
      });
  }

  private static async domainFolders(name: string, orm: ORM) {
    let blockPath = `./Domains/${name}`;
    await this.httpFolders(blockPath, name);
    await this.routeFolder(blockPath, name);
    await this.modelFolder(blockPath, name, orm);
    await this.serviceFolder(blockPath, name);
    await this.serviceProviderFolder(blockPath, name);
    await this.RepositoryFolder(blockPath);
    await this.TestsFolder(blockPath);
  }

  private static async RepositoryFolder(path: string) {
    shell.mkdir(`${path}/Repository`);
  }

  private static async TestsFolder(path: string) {
    shell.mkdir(`${path}/Tests`);
  }

  private static async ValidationFolder(path: string) {
    shell.mkdir(`${path}/Validation`);
  }

  private static async httpFolders(path: string, name: string) {
    this.createDirectory(`${path}/Http`);
    let blockPath = `${path}/Http`;
    await this.ValidationFolder(blockPath);
    await this.domainController(blockPath, name);
  }

  private static async domainController(path: string, name: string) {
    this.createDirectory(`${path}/Controller`);
    fs.appendFile(`${path}/Controller/${name}Controller.ts`, await controller.controllerBodyWithResource(`${name}Controller`), function (err: any) {
      if (err) throw err;
      BaseCommand.success(`${name} controller successfully generated in Domains/${name}/Http/Controller directory`);
    });
  }

  private static async routeFolder(path: string, name: string) {
    shell.mkdir(`${path}/Routes`);
    fs.appendFile(`${path}/Routes/index.ts`, await route.routeBody(name), function (err: any) {
      if (err) throw err;
      BaseCommand.success(`${name} route successfully generated in Domains/${name}/Routes directory`);
    });
  }

  private static async modelFolder(path: string, name: string, orm: ORM) {
    shell.mkdir(`${path}/Model`);
    fs.appendFile(`${path}/Model/${name}Model.ts`, this.modelBody(name, orm), function (err: any) {
      if (err) throw err;
      BaseCommand.success(`${name} model successfully generated in Domains/${name}/Model directory`);
    });
  }

  private static modelBody(name: string, orm: ORM) {
    if (orm !== ORM.Mongoose) {
      return SqlProgram.modelBody(name, orm);
    } else {
      return NoSqlProgram.generateModel(name);
    }
  }

  private static serviceProviderFolder(path: string, name: string) {
    shell.mkdir(`${path}/Provider`);
    let providerPath = `${path}/Provider`;
    fs.appendFile(`${providerPath}/${name}ServiceProvider.ts`, this.providerBody(name), function (err) {
      if (err) throw err;
      BaseCommand.success(`${name}ServiceProvider.ts successfully generated in Domains/${name}/Provider directory`);
    });
  }

  private static providerBody(name: string) {
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

  private static async serviceFolder(path: string, name: string) {
    shell.mkdir(`${path}/Service`);
    let servicePath = `${path}/Service`;
    this.loadAbstractService(servicePath, name);
    this.loadService(servicePath, name);
  }

  private static loadAbstractService(servicePath: string, name: string) {
    fs.appendFile(`${servicePath}/${name}Service.ts`, serviceProgram.generateServiceAbstractClass(name), function (err) {
      if (err) throw err;
      BaseCommand.success(`${name}Service.ts abstract class successfully generated in Domains/${name}/Service directory`);
    });
  }

  private static loadService(servicePath: string, name: string) {
    fs.appendFile(`${servicePath}/${name}ServiceImpl.ts`, serviceProgram.generateService(name, false), function (err) {
      if (err) throw err;
      BaseCommand.success(`${name}ServiceImpl implementation class successfully generated in Domains/${name}/Service directory`);
    });
  }
}

export default MakeDomainProgram;
