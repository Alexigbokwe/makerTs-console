"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Arguments = exports.ORM = exports.mode = void 0;
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
var Arguments;
(function (Arguments) {
    Arguments["migration"] = "m";
    Arguments["broker"] = "b";
    Arguments["resourceController"] = "r";
})(Arguments = exports.Arguments || (exports.Arguments = {}));
