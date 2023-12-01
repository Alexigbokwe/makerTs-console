"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.argumentChecker = void 0;
function argumentChecker(data) {
    if (data.argument && data.argument !== data.checker) {
        throw new Error(`error: ${data.argument} is not a valid argument`);
    }
}
exports.argumentChecker = argumentChecker;
