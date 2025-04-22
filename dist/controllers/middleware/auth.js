"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const requireAuth = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        res.status(401).json({ error: "Missing Authorization header" });
        return;
    }
    const token = authHeader.split(" ")[1];
    if (token !== process.env.AUTH_TOKEN) {
        res.status(403).json({ error: "Invalid token" });
        return;
    }
    next();
};
exports.requireAuth = requireAuth;
