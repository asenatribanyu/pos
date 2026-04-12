import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import db from "../database/database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const models = {};

const files = fs
  .readdirSync(__dirname)
  .filter((file) => file !== "index.js" && file.endsWith(".js"));

for (const file of files) {
  const modulePath = path.join(__dirname, file);

  const modelModule = await import(pathToFileURL(modulePath));

  const model = modelModule.default(db);
  models[model.name] = model;
}

Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

export default models;
