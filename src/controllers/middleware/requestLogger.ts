import { Request, Response, NextFunction } from "express";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const start = process.hrtime();
  res.on("finish", () => {
    const diff = process.hrtime(start);
    const ms = diff[0] * 1000 + diff[1] / 1e6;
    console.log(
      `${req.method} ${req.originalUrl} [${res.statusCode}] - ${ms.toFixed(
        2
      )} ms`
    );
  });
  next();
};
