"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metrics = void 0;
const metrics = (req, res) => {
    res.json({
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        timestamp: new Date().toISOString(),
    });
};
exports.metrics = metrics;
