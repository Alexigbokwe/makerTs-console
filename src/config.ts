"use strict";

let commands: any;
commands = {
  "make-auth": "commands/auth",
  "make-controller": "commands/controller",
  //"make-event": "commands/event",   ==> depreciated
  //"make-listener": "commands/listener", ==> depreciated
  "make-middleware": "commands/middleware",
  "make-nosql-model": "commands/nosqlModel",
  "make-validation": "commands/validation",
  "make-route": "commands/route",
  "make-sql-model": "commands/sqlModel",
  "make-ws-controller": "commands/wsController",
  "make-sql-migration": "commands/migrations/makeSqlMigration",
  "make-command": "commands/makeCommand",
  "make-identity": "commands/identity",
  "make-job": "commands/job",
  "make-service": "commands/makeService",
  "make-provider": "commands/serviceProvider",
  "make-rule": "commands/customValidationRule",
  "run-schedule": "commands/schedule",
  "run-sql-migration": "commands/migrations/runSqlMigration",
  "show-sql-list": "commands/migrations/showSqlList",
  "sql-rollback": "commands/migrations/sqlRollBack",
  "sql-rolldown": "commands/migrations/sqlRollDown",
  "sql-rollup": "commands/migrations/sqlRollUp",
  "queue-work": "commands/queueWork",
  "run-dev": "commands/packageScripts/runDev",
  "run-build": "commands/packageScripts/runBuild",
  "run-start": "commands/packageScripts/runStart",
  "run-prod": "commands/packageScripts/runProd",
  "make-domain": "commands/Domain/makeDomain",
  "domain:make-controller": "commands/Domain/makeController",
  "domain:make-model": "commands/Domain/makeModel",
};

export default commands;
