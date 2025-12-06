import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { db } from "./model/index.js";
import router from "./route/route.js";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", router);

db.sync({ alter: true }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
