"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
require("reflect-metadata"); // This must be at the very top
require("./config/container"); // Initialize dependency injection
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const Routes_1 = __importDefault(require("./controllers/Routes"));
const requestLogger_1 = require("./controllers/middleware/requestLogger");
const errorHandler_1 = require("./controllers/middleware/errorHandler");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(body_parser_1.default.json());
app.use(requestLogger_1.requestLogger);
app.use("/api", Routes_1.default);
app.use(errorHandler_1.errorHandler);
// Only start listening if this file is the entrypoint
console.log(">> Booting GiggleMap app…");
app.listen(port, () => {
    console.log(`GiggleMap backend service running on port ${port}`);
});
exports.default = app;
