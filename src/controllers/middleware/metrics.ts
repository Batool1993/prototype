import { Request, Response } from "express";

export const metrics = (req: Request, res: Response): void => {
  res.json({
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    timestamp: new Date().toISOString(),
  });
};
