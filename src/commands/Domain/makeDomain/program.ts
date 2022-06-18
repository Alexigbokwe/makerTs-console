"use strict";
import Ora from "ora";
import fs from "fs";
import BaseCommand from "../../baseCommand";
import shell from "shelljs";
const spinner = Ora("Processing: ");
import controller from "../../controller/program";
import route from "../../route/program";
import sqlmodel from "../../sqlModel/program";
import noSqlProgram from "../../nosqlModel/program";
import serviceProgram from "../../makeService/program";

class MakeDomainProgram {
  static async handle(name: string) {
    spinner.start();
    spinner.color = "magenta";
    spinner.text = "Generating Domain";
    name = name[0].toUpperCase() + name.slice(1);

    try {
      this.createDirectory("./Domains");
      if (!this.createDirectory("./Domains/" + name)) {
        throw new Error(name + " domain aleady exist");
      } else {
        await this.nextStep(name);
        spinner.color = "green";
        spinner.text = "Completed";
        spinner.succeed(name + " domain successfull generated.");
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

  private static async nextStep(name: string) {
    await this.domainFolders(name)
      .then(() => {
        BaseCommand.success(`${name} Domain Successfully Generated`);
      })
      .catch((error) => {
        BaseCommand.success(`Error Occured  While  Generating ${name} Domain: ${error}`);
      });
  }

  private static async domainFolders(name: string) {
    let blockPath = `./Domains/${name}`;
    await this.httpFolders(blockPath, name);
    await this.routeFolder(blockPath, name);
    await this.modelFolder(blockPath, name);
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

  private static async httpFolders(path: string, name: string) {
    this.createDirectory(`${path}/Http`);
    let blockPath = `${path}/Http`;
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

  private static async modelFolder(path: string, name: string) {
    shell.mkdir(`${path}/Model`);
    fs.appendFile(`${path}/Model/${name}Model.ts`, this.modelBody(name), function (err: any) {
      if (err) throw err;
      BaseCommand.success(`${name} model successfully generated in Domains/${name}/Model directory`);
    });
  }

  private static modelBody(name: string) {
    if (process.env.DB_CONNECTION != "mongoose") {
      return sqlmodel.modelBody(name);
    } else {
      return noSqlProgram.generateModel(name);
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

    let body =
      `
      import ServiceProvider from "Elucidate/Support/ServiceProvider";

      class ` +
      name +
      ` extends ServiceProvider{
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
        public async booted():void {
          //
        }
      }

        export default ` +
      name +
      `;
        `;
    return body;
  }

  private static async serviceFolder(path: string, name: string) {
    shell.mkdir(`${path}/Service`);
    let servicePath = `${path}/Service`;
    this.loadInterface(servicePath, name);
    this.loadService(servicePath, name);
  }

  private static loadInterface(servicePath: string, name: string) {
    fs.appendFile(`${servicePath}/I${name}Service.ts`, serviceProgram.generateServiceInterface(name), function (err) {
      if (err) throw err;
      BaseCommand.success(`I${name}Service.ts interface successfully generated in Domains/${name}/Service directory`);
    });
  }

  private static loadService(servicePath: string, name: string) {
    fs.appendFile(`${servicePath}/index.ts`, serviceProgram.generateService(`${name}Service`), function (err) {
      if (err) throw err;
      BaseCommand.success(`${name}Service implementation class successfully generated in Domains/${name}/Service directory`);
    });
  }
}

export default MakeDomainProgram;
