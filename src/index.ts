import "dotenv/config";
import "reflect-metadata"; // This must be at the very top
import "./config/container"; // Initialize dependency injection
import express from "express";
import bodyParser from "body-parser";
import router from "./controllers/Routes";
import { requestLogger } from "./controllers/middleware/requestLogger";
import { errorHandler } from "./controllers/middleware/errorHandler";

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(requestLogger);
app.use("/api", router);
app.use(errorHandler);

// Only start listening if this file is the entrypoint
console.log(">> Booting GiggleMap app…");

  app.listen(port, () => {
    console.log(`GiggleMap backend service running on port ${port}`);
  });


export default app;