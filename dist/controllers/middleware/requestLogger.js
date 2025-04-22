"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = void 0;
const requestLogger = (req, res, next) => {
    const start = process.hrtime();
    res.on("finish", () => {
        const diff = process.hrtime(start);
        const ms = diff[0] * 1000 + diff[1] / 1e6;
        console.log(`${req.method} ${req.originalUrl} [${res.statusCode}] - ${ms.toFixed(2)} ms`);
    });
    next();
};
exports.requestLogger = requestLogger;
