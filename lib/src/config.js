"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let config = new Map();
config.set("make-auth", "commands/auth");
config.set("make-controller", "commands/controller");
// config.set("make-event", "commands/event")   ==> depreciated
// config.set("make-listener", "commands/listener") ==> depreciated
config.set("make-middleware", "commands/middleware");
config.set("make-nosql-model", "commands/nosqlModel");
config.set("make-validation", "commands/validation");
config.set("make-route", "commands/route");
config.set("make-sql-model", "commands/sqlModel");
config.set("make-ws-controller", "commands/wsController");
config.set("make-sql-migration", "commands/migrations/makeSqlMigration");
config.set("make-command", "commands/makeCommand");
// config.set("make-identity", "commands/identity") ==> depreciated
config.set("make-job", "commands/job");
config.set("make-service", "commands/makeService");
config.set("make-provider", "commands/serviceProvider");
config.set("make-rule", "commands/customValidationRule");
config.set("run-schedule", "commands/schedule");
config.set("run-sql-migration", "commands/migrations/runSqlMigration");
config.set("show-sql-list", "commands/migrations/showSqlList");
config.set("sql-rollback", "commands/migrations/sqlRollBack");
config.set("sql-rolldown", "commands/migrations/sqlRollDown");
config.set("sql-rollup", "commands/migrations/sqlRollUp");
config.set("queue-work", "commands/queueWork");
config.set("run-dev", "commands/packageScripts/runDev");
config.set("run-build", "commands/packageScripts/runBuild");
config.set("run-start", "commands/packageScripts/runStart");
config.set("run-prod", "commands/packageScripts/runProd");
config.set("make-domain", "commands/Domain/makeDomain");
config.set("domain:make-controller", "commands/Domain/makeController");
config.set("domain:make-model", "commands/Domain/makeModel");
exports.default = config;
