import shell from "shelljs";
import copy from "recursive-copy";

let config: any;
if (process.env.APP_ENV == "local" || process.env.APP_ENV == "development" || process.env.APP_ENV == "test") {
  config = require("../../../../../../../Config/App").default;
} else if (process.env.APP_ENV == "production" || process.env.APP_ENV == "staging") {
  config = require("../../../../../../../build/Config/App.js").default;
}

class CompileProgramProgram {
  static handle() {
    this.buildFile();
  }

  private static buildFile() {
    if (shell.exec("rimraf ./build && tsc -p .").code !== 0) {
      shell.echo("Error: Build project command failed");
      shell.exit(1);
    } else {
      let directories = config.static_directories;
      if (directories.length > 0) {
        this.copyStaticDirectories(directories);
      }
    }
  }

  private static copyStaticDirectories(directories: Array<{ name: string; source: string; destination: string }>) {
    directories.map((directory: { name: string; source: string; destination: string }) => {
      copy(process.cwd() + "/" + directory.source, process.cwd() + "/" + directory.destination).catch(function (error) {
        console.error("Copy failed: " + error);
      });
    });
  }
}

export default CompileProgramProgram;
