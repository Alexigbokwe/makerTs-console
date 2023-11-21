"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commandOptionChecker = void 0;
const commandOptionChecker = (options) => {
    const optionKeys = Object.keys(options);
    for (const key of optionKeys) {
        if (!process.argv.includes(key)) {
            throw new Error(`error: unknown option, the right option(s) are:  ${optionKeys}`);
        }
    }
};
exports.commandOptionChecker = commandOptionChecker;
