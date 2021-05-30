"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ora_1 = __importDefault(require("ora"));
const fs_1 = __importDefault(require("fs"));
const baseCommand_1 = __importDefault(require("../baseCommand"));
const spinner = ora_1.default("Processing: ");
class IdentityProgram {
    static async handle() {
        let driver = this.checkDatabaseDriver();
        if (driver === "nosql") {
            await this.ProcessNoSqlIdentity();
        }
        else if (driver === "sql") {
            await this.ProcessSqlIdentity();
        }
        else {
            throw new Error("Cannot determine database driver, make sure `DB_CONNECTION` is set in .env file");
        }
    }
    static async ProcessSqlIdentity() {
        await this.generateModel("sql", "Permissions_model", "permissions"); //Permissions_model
        await this.generateModel("sql", "Roles_model", "roles"); //Roles_model
        await this.generateModel("sql", "Role_permissions_model", "role_permissions"); //Role_permissions_model
        await this.generateModel("sql", "User_roles_model", "user_roles"); //User_roles_model
    }
    static async ProcessNoSqlIdentity() {
        await this.generateModel("nosql", "Permissions_model", "permissions"); //Permissions_model
        await this.generateModel("nosql", "Roles_model", "roles"); //Roles_model
        await this.generateModel("nosql", "Role_permissions_model", "role_permissions"); //Role_permissions_model
        await this.generateModel("nosql", "User_roles_model", "user_roles"); //User_roles_model
    }
    static checkDatabaseDriver() {
        return process.env.DB_CONNECTION == "mongoose" ? "nosql" : "sql";
    }
    static async generateModel(section, fileName, modelName) {
        spinner.start();
        spinner.color = "magenta";
        spinner.text = `Generating ${fileName}`;
        let checkFolder = baseCommand_1.default.checkFolderExists("./App/Model");
        if (checkFolder) {
            let doesFileExist = await baseCommand_1.default.checkFileExists(`./App/Model/${fileName}.ts`);
            if (doesFileExist == false) {
                return section == "nosql" ? await this.nextStep(fileName, this.generateNoSqlModel(modelName)) : await this.nextStep(fileName, this.generateSqlModel(modelName));
            }
            else {
                spinner.color = "red";
                spinner.text = "failed";
                spinner.fail("");
                await baseCommand_1.default.error(`${fileName}.ts already exist.`);
                return false;
            }
        }
    }
    static async nextStep(filename, generateModel) {
        fs_1.default.appendFile(`./App/Model/${filename}.ts`, generateModel, function (err) {
            if (err) {
                spinner.color = "red";
                spinner.text = "failed";
                spinner.fail("");
                baseCommand_1.default.error(err.errno);
                return false;
            }
            spinner.color = "green";
            spinner.text = "Completed";
            spinner.succeed("Completed 😊😘");
            baseCommand_1.default.success(`${filename}.ts class successfully generated in App/Model folder`);
            return true;
        });
    }
    static generateNoSqlModel(modelName) {
        switch (modelName) {
            case "permissions":
                let permissions = `"use strict";
        import { mongoose, Schema, Document } from "Elucidate/Database/NoSQLModel";

        export interface PermissionsInterface extends Document {
          name: string;
          description: string;
        }
        
        const PermissionsSchema: Schema = new Schema({
          name: { type: String, required: true },
          description: { type: String, required: true },
        });
        PermissionsSchema.set("timestamps", true);
        const Permissions = mongoose.model<PermissionsInterface>("Permissions", PermissionsSchema);
        export default Permissions;`;
                return permissions;
            case "role_permissions":
                let role_permissions = `"use strict";
        import { mongoose, Schema, Document } from "Elucidate/Database/NoSQLModel";

        export interface Role_permissionsInterface extends Document {
            role_id: string;
            permission_id: string;
        }
        
        const Role_permissionsSchema: Schema = new Schema({
            role_id: { type: mongoose.Schema.Types.ObjectId, ref: "Roles" },
            permission_id: { type: mongoose.Schema.Types.ObjectId, ref: "Permissions" },
        });
        Role_permissionsSchema.set("timestamps", true);
        const Role_permissions = mongoose.model<Role_permissionsInterface>("Role_permissions", Role_permissionsSchema);
        export default Role_permissions;`;
                return role_permissions;
            case "user_roles":
                let user_roles = `"use strict";
        import { mongoose, Schema, Document } from "Elucidate/Database/NoSQLModel";

        export interface User_rolesInterface extends Document {
          user_id: string;
          role_id: string;
        }
        
        const User_rolesSchema: Schema = new Schema({
          user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          role_id: { type: mongoose.Schema.Types.ObjectId, ref: "Roles" },
        });
        User_rolesSchema.set("timestamps", true);
        const User_roles = mongoose.model<User_rolesInterface>("Permissions", User_rolesSchema);
        export default User_roles;`;
                return user_roles;
            case "roles":
                let roles = `"use strict";
        import { mongoose, Schema, Document } from "Elucidate/Database/NoSQLModel";

        export interface RolesInterface extends Document {
          name: string;
          description: string;
        }
        
        const RolesSchema: Schema = new Schema({
            name: { type: String, required: true },
            description: { type: String, required: true },
        });
        RolesSchema.set("timestamps", true);
        const Roles = mongoose.model<RolesInterface>("Permissions", RolesSchema);
        export default Roles;`;
                return roles;
            default:
                break;
        }
    }
    static generateSqlModel(modelName) {
        switch (modelName) {
            case "permissions":
                let permissions = `"use strict";
        import { Model } from "Elucidate/Database/Model";
    
        class Permissions extends Model {
          // Model attributes
          id!: number;
          name!: string;
          description!: string;
        
          // Table name
          static tableName = "permissions";
        }
        
        export default Permissions;`;
                return permissions;
            case "role_permissions":
                let role_permissions = `"use strict";
        import { Model } from "Elucidate/Database/Model";
    
        class Role_permissions extends Model {
            // Model attributes
            id!: number;
            role_id!: string;
            permission_id!: string;
        
            // Table name
            static tableName = "role_permissions";
        }
        
        export default Role_permissions;`;
                return role_permissions;
            case "user_roles":
                let user_roles = `"use strict";
        import { Model } from "Elucidate/Database/Model";
    
        class User_roles extends Model {
            // Model attributes
            id!: number;
            user_id!: string;
            role_id!: string;
        
            // Table name
            static tableName = "user_roles";
        }
        
        export default User_roles;`;
                return user_roles;
            case "roles":
                let roles = `"use strict";
                import { Model } from "Elucidate/Database/Model";
                import Permission_model from './Permissions_model'
            
                class Roles extends Model {
                    // Model attributes
                    id!: number;
                    name!: string;
                    description!: string;
                
                    // Table name
                    static tableName = "roles";

                    static get jsonSchema() {
                    return {
                        type: "object",
                        required: ["name", "description"],
                        properties: {
                        id: { type: "integer" },
                        name: { type: "string", minLength: 1, maxLength: 255 },
                        descriptioon: { type: "string", minLength: 1, maxLength: 255 },
                        },
                    };
                    }

                    static relationMappings = {
                        permissions: {
                          relation: Model.ManyToManyRelation,
                          modelClass: Permission_model,
                          join: {
                            from: "roles.id",
                            through: {
                              from: "role_permissions.role_id",
                              to: "role_permissions.permission_id",
                            },
                            to: "permissions.id",
                          },
                        },
                      };
                }
                
                export default Roles;`;
                return roles;
            default:
                break;
        }
    }
}
exports.default = IdentityProgram;