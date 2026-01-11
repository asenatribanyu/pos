import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { db } from "./model/index.js";
import router from "./route/route.js";
import logger from "./log/logger.js";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", router);
app.use(/^\/api\/.*/, (req, res) => {
  logger.warn(`404 Not Found API: ${req.originalUrl}`);
  return res.status(404).json({
    meta: {
      code: 404,
      message: "Not Found: The requested API endpoint does not exist",
    },
  });
});

app.use(/.*/, (req, res) => {
  logger.warn(`404 Not Found Route: ${req.originalUrl}`);
  return res.status(404).send("Page not found");
});

db.sync({ alter: true }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
