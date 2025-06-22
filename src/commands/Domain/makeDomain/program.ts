"use strict";
import { promises as fs } from "fs";
import path from "path";
import BaseCommand from "../../baseCommand";
import controller from "../../controller/program";
import { RouteProgram } from "../../route/program";
import { SqlProgram } from "../../sqlModel/program";
import { NoSqlProgram } from "../../nosqlModel/program";
import { ServiceProgram } from "../../makeService/program";
import { ORM } from "../../../Types/CommandTypes";

class MakeDomainProgram {
  static async handle(name: string, orm: ORM) {
    const spinner = BaseCommand.progress();
    spinner.start(`Generating Domain ${name}`);
    name = name[0].toUpperCase() + name.slice(1);
    const domainPath = path.join("Domains", name);

    try {
      if (await BaseCommand.checkFileExists(domainPath)) {
        throw new Error(`${name} domain already exists.`);
      }

      await this.nextStep(name, orm, domainPath);
      spinner.succeed(`${name} domain successfully generated.`);
    } catch (error) {
      spinner.fail((error as Error).message);
    }
  }

  private static async nextStep(name: string, orm: ORM, domainPath: string) {
    try {
      await this.domainFolders(name, orm, domainPath);
      BaseCommand.success(`${name} Domain Successfully Generated`);
    } catch (error) {
      throw new Error(`Error Occurred While Generating ${name} Domain: ${error}`);
    }
  }

  private static async domainFolders(name: string, orm: ORM, domainPath: string) {
    const foldersToCreate = ["Http/Controller", "Http/Validation", "Model", "Provider", "Repository", "Routes", "Service", "Tests"];

    for (const folder of foldersToCreate) {
      await fs.mkdir(path.join(domainPath, folder), { recursive: true });
    }

    await this.domainController(path.join(domainPath, "Http", "Controller"), name);
    await this.routeFolder(path.join(domainPath, "Routes"), name);
    await this.modelFolder(path.join(domainPath, "Model"), name, orm);
    await this.serviceFolder(path.join(domainPath, "Service"), name);
    await this.serviceProviderFolder(path.join(domainPath, "Provider"), name);
  }

  private static async domainController(controllerPath: string, name: string) {
    const controllerName = `${name}Controller`;
    const filePath = path.join(controllerPath, `${controllerName}.ts`);
    const body = await controller.controllerBodyWithResource(controllerName);
    await fs.writeFile(filePath, body);
    BaseCommand.success(`${controllerName}.ts successfully generated in ${path.dirname(filePath)}`);
  }

  private static async routeFolder(routePath: string, name: string) {
    const filePath = path.join(routePath, "index.ts");
    const body = await RouteProgram.routeBody(name);
    await fs.writeFile(filePath, body);
    BaseCommand.success(`index.ts route successfully generated in ${routePath}`);
  }

  private static async modelFolder(modelPath: string, name: string, orm: ORM) {
    const modelName = `${name}Model`;
    const filePath = path.join(modelPath, `${modelName}.ts`);
    const body = this.modelBody(name, orm);
    await fs.writeFile(filePath, body);
    BaseCommand.success(`${modelName}.ts successfully generated in ${modelPath}`);
  }

  private static modelBody(name: string, orm: ORM) {
    if (orm !== ORM.Mongoose) {
      return SqlProgram.modelBody(name, orm);
    } else {
      return NoSqlProgram.generateModel(name);
    }
  }

  private static async serviceProviderFolder(providerPath: string, name: string) {
    const providerName = `${name}ServiceProvider`;
    const filePath = path.join(providerPath, `${providerName}.ts`);
    const body = this.providerBody(name);
    await fs.writeFile(filePath, body);
    BaseCommand.success(`${providerName}.ts successfully generated in ${providerPath}`);
  }

  private static providerBody(name: string) {
    const providerName = `${name}ServiceProvider`;

    return `
      import {ServiceProvider} from "Elucidate/Support/ServiceProvider";

      export class ${providerName} extends ServiceProvider{
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
  }

  private static async serviceFolder(servicePath: string, name: string) {
    await this.loadAbstractService(servicePath, name);
    await this.loadService(servicePath, name);
  }

  private static async loadAbstractService(servicePath: string, name: string) {
    const serviceName = `${name}Service`;
    const filePath = path.join(servicePath, `${serviceName}.ts`);
    const body = ServiceProgram.generateServiceAbstractClass(name);
    await fs.writeFile(filePath, body);
    BaseCommand.success(`${serviceName}.ts abstract class successfully generated in ${servicePath}`);
  }

  private static async loadService(servicePath: string, name: string) {
    const serviceImplName = `${name}ServiceImpl`;
    const filePath = path.join(servicePath, `${serviceImplName}.ts`);
    const body = ServiceProgram.generateService(name, false);
    await fs.writeFile(filePath, body);
    BaseCommand.success(`${serviceImplName} implementation class successfully generated in ${servicePath}`);
  }
}

export default MakeDomainProgram;
