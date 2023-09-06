import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import bodyParser from "body-parser";
import { connect } from "mongoose";

import { IconsType } from "./types/types";

import Icons from "./models/icons";

import load from "./routes/load";
import report from "./routes/report";
import icon from "./routes/icon";
import imp from "./routes/import";
import analytics from "./routes/analytics";
import update from "./routes/update";

dotenv.config();
const { APP_PORT, BOT, ADMIN, DB_CONNECTION_STRING } = process.env;
if (!APP_PORT || !BOT || !ADMIN || !DB_CONNECTION_STRING) {
  console.error(`Environment Variables not set`);
  process.exit(1);
}

let ico: IconsType;

const app = express();

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(cors());
app.use(express.static(`public`));

app.use(async (req, res, next) => {
  if (!ico) {
    const data = await Icons.findOne();
    if (data) ico = data.icons;
  }

  if (!ico)
    return res
      .status(400)
      .json({ message: `Sorry, we couldn't run the plugin!` });

  req.ico = ico;
  return next();
});

app.get(`/data`, load(true));
app.get(`/load`, load());
app.get(`/import`, imp);
app.get(`/icon`, icon);
app.get(`/report`, report);
app.get(`/analytics`, analytics);

app.post(`/${BOT}`, update);

(async () => {
  await connect(DB_CONNECTION_STRING);
  app.listen(APP_PORT, () => console.log(`Server started at ${APP_PORT}`));
})();
