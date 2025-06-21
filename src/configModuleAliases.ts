import "module-alias/register";
import fs from "fs";
import path from "path";
import moduleAlias from "module-alias";
import ts from "typescript";
import { projectDirectory } from "./RootDirectory";

const Environments = ["staging", "production", "prod"];
const CurrentEnvironment = process.env["APP_ENV"] || process.env["NODE_ENV"];
if (Environments.includes(CurrentEnvironment!)) {
  function loadTsConfig(configFile: string) {
    const configText = fs.readFileSync(configFile, "utf-8");
    const configJson = ts.parseConfigFileTextToJson(configFile, configText);
    const configObject = ts.convertCompilerOptionsFromJson(configJson.config.compilerOptions, ".");

    // Get paths
    return configObject.options.paths;
  }

  // Read tsconfig.json
  let directory = projectDirectory;
  const isInBuild = projectDirectory.includes("build");
  if (isInBuild) {
    directory = projectDirectory.replace("build/", "");
  }
  const tsConfigPath = `${directory}/node_modules/expresswebjs-preset-ts/tsconfig.json`;
  // Extract path mappings
  const paths = loadTsConfig(tsConfigPath);
  if (!paths) {
    throw new Error("No valid path found");
  }
  // Configure module-alias
  const aliases: { [key: string]: string } = Object.entries(paths).reduce((acc, [key, values]) => {
    // For each path, add an alias
    const aliasKey = key.replace("/*", "");
    const aliasValue = path.resolve(__dirname, (values as string[])[0].replace("/*", ""));
    acc[aliasKey] = aliasValue;
    return acc;
  }, {} as { [key: string]: string });

  const baseSubstring = "maker-console-ts/lib/src";

  let PathAliases: { [key: string]: string } = {};

  for (const key in aliases) {
    const startIndex = aliases[key].lastIndexOf(baseSubstring);
    if (startIndex !== -1) {
      PathAliases[key] = process.cwd() + "/" + aliases[key].substring(startIndex + baseSubstring.length + 1);
    } else {
      PathAliases[key] = aliases[key];
    }
  }

  moduleAlias.addAliases(PathAliases);
} else {
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
