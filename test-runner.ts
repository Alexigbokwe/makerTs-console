import { Console } from "./src/index";
import { TestCommand } from "./src/test/TestCommand";
import { ORM } from "./src/Types/CommandTypes";

// The 'kernel' is where you would register your custom commands.
const kernel = {
  commands: () => {
    return [TestCommand];
  },
};

// The first argument to Console.run() is for built-in "maker" commands.
// All commands now use the enhanced handle pattern.
const makerCommands = ["make-controller", "make-command", "make-middleware", "make-route", "make-job", "make-event", "make-listener", "make-service", "make-provider", "make-sql-model", "make-nosql-model", "make-auth", "make-ws-controller", "make-rule", "make-validation", "make-sql-migration", "run-sql-migration", "show-sql-list", "sql-rollback", "sql-rolldown", "sql-rollup", "make-domain", "domain:make-controller", "domain:make-model", "queue-work", "run-schedule"];

// The ORM type does not affect this test.
Console.run(makerCommands, kernel, ORM.Objection);
