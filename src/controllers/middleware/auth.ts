import { Request, Response, NextFunction } from "express";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
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
