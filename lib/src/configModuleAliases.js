"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("module-alias/register");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const module_alias_1 = __importDefault(require("module-alias"));
const typescript_1 = __importDefault(require("typescript"));
const RootDirectory_1 = require("./RootDirectory");
const Environments = ["staging", "production", "prod"];
const CurrentEnvironment = process.env["APP_ENV"] || process.env["NODE_ENV"];
if (Environments.includes(CurrentEnvironment)) {
    function loadTsConfig(configFile) {
        const configText = fs_1.default.readFileSync(configFile, "utf-8");
        const configJson = typescript_1.default.parseConfigFileTextToJson(configFile, configText);
        const configObject = typescript_1.default.convertCompilerOptionsFromJson(configJson.config.compilerOptions, ".");
        // Get paths
        return configObject.options.paths;
    }
    // Read tsconfig.json
    let directory = RootDirectory_1.projectDirectory;
    const isInBuild = RootDirectory_1.projectDirectory.includes("build");
    if (isInBuild) {
        directory = RootDirectory_1.projectDirectory.replace("build/", "");
    }
    const tsConfigPath = `${directory}/node_modules/expresswebjs-preset-ts/tsconfig.json`;
    // Extract path mappings
    const paths = loadTsConfig(tsConfigPath);
    if (!paths) {
        throw new Error("No valid path found");
    }
    // Configure module-alias
    const aliases = Object.entries(paths).reduce((acc, [key, values]) => {
        // For each path, add an alias
        const aliasKey = key.replace("/*", "");
        const aliasValue = path_1.default.resolve(__dirname, values[0].replace("/*", ""));
        acc[aliasKey] = aliasValue;
        return acc;
    }, {});
    const baseSubstring = "maker-console-ts/lib/src";
    let PathAliases = {};
    for (const key in aliases) {
        const startIndex = aliases[key].lastIndexOf(baseSubstring);
        if (startIndex !== -1) {
            PathAliases[key] = process.cwd() + "/" + aliases[key].substring(startIndex + baseSubstring.length + 1);
        }
        else {
            PathAliases[key] = aliases[key];
        }
    }
    module_alias_1.default.addAliases(PathAliases);
}
else {
    throw new Error(`
  Missing or incorrect APP_ENV or NODE_ENV configuration.
  Current configuration value: ${CurrentEnvironment || "undefined"}

  Please ensure the following:
  1. The .env file exists in the root of your project.
  2. The NODE_ENV variable is set to one of the following values: "staging", "production", "prod".

  Example .env file content:
  APP_ENV=staging
`);
}
