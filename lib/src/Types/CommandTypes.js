"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ORM = exports.mode = void 0;
var mode;
(function (mode) {
    mode["REQUIRED"] = "REQUIRED";
    mode["OPTIONAL"] = "OPTIONAL";
})(mode = exports.mode || (exports.mode = {}));
var ORM;
(function (ORM) {
    ORM["Objection"] = "Objection";
    ORM["Mongoose"] = "Mongoose";
    ORM["TypeORM"] = "TypeORM";
})(ORM = exports.ORM || (exports.ORM = {}));
