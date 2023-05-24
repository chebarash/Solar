import dotenv from "dotenv";
import cors from "cors";
import express, { Request, Response } from "express";
import { Schema, model, connect } from "mongoose";
import * as Figma from "figma-api";
import axios from "axios";

import { IconsType, ImpType, ReqType } from "./types";

dotenv.config();
const { TOKEN, FILE, PORT, BOT, ADMIN, MONGO, NODE_ENV } = process.env;

if (!TOKEN || !FILE || !PORT || !BOT || !ADMIN || !MONGO) {
  console.error("\x1b[31mEnvironment Variables not set.\x1b[0m");
  process.exit(1);
}

const api = new Figma.Api({ personalAccessToken: TOKEN });
const app = express();

const chunkSize = 580;

const urls: { [id: string]: string } = {};

let loaded = 0;

const IconsSchema = new Schema<{ icons: IconsType }>({ icons: Object });
const Icons = model<{ icons: IconsType }>("Icons", IconsSchema);

const ReqSchema = new Schema<ReqType>({
  date: Date,
  time: Number,
  cached: Boolean,
});
const Req = model<ReqType>("req", ReqSchema);

const ImpSchema = new Schema<ImpType>({ date: Date, icons: Array });
const Imp = model<ImpType>("imp", ImpSchema);

let ico: IconsType;

const progress = (total: number, stat: number) => {
  process.stderr.cursorTo(0);
  if (stat / total >= 1) return process.stderr.clearLine(0);
  const width = process.stderr.columns;
  const completeLength = Math.round(width * (stat / total));
  const complete = Array(Math.max(0, completeLength)).join(`\x1b[46m \x1b[0m`);
  const incomplete = Array(Math.max(0, width - completeLength)).join(
    `\x1b[47m \x1b[0m`
  );
  process.stderr.write(complete + incomplete);
  process.stderr.clearLine(1);
};

const download = async (url: string): Promise<string> => {
  try {
    const { data } = await axios.get<string>(url);
    loaded++;
    progress(Object.keys(urls).length, loaded);
    return data;
  } catch (e) {
    return await download(url);
  }
};

(async () => {
  await connect(MONGO);

  if (NODE_ENV !== `production`) {
    const icons: IconsType = {};

    console.log(`Get File`);

    const { components } = await api.getFile(FILE, { ids: [`0:1`] });
    const ids = Object.keys(components);

    console.log(`Get Image`);

    for (let i = 0; i < ids.length; i += chunkSize) {
      progress(ids.length, i + chunkSize);
      Object.assign(
        urls,
        (
          await api.getImage(FILE, {
            ids: ids.slice(i, i + chunkSize).join(`,`),
            format: `svg`,
            scale: 1,
          })
        ).images
      );
    }

    console.log(`Downloading`);

    progress(Object.keys(urls).length, 0);
    await Promise.all(
      ids.map(async (id) => {
        const [style, category, name]: Array<string> = components[id].name
          .split(` / `)
          .map((s) => s.replace(/  /, ` `).trim());
        if (!icons[category]) icons[category] = {};
        if (!icons[category][name]) icons[category][name] = {};
        return (icons[category][name][style] = await download(urls[id]));
      })
    );

    ico = icons;
    await Icons.deleteMany({});
    await new Icons({ icons }).save();

    console.log(`Saved`);
  }

  app.use(cors());

  app.get("/", async (_req: Request, res: Response) => {
    res.send(`Solar Icon Set`);
  });

  app.get("/data", async (_req, res: Response) => {
    try {
      const start = performance.now();

      if (!ico) {
        const data = await Icons.findOne({});
        if (data) ico = data.icons;
      }

      if (!ico)
        return res
          .status(400)
          .json({ message: `Sorry, we couldn't run the plugin!` });

      res.json(ico);

      await new Req({
        date: Date.now(),
        time: performance.now() - start,
        cached: false,
      }).save();
    } catch (e) {
      console.log(e);
    }
  });

  app.get("/load", async (_req, res: Response) => {
    try {
      const start = performance.now();
      res.json({ ok: true });
      await new Req({
        date: Date.now(),
        time: performance.now() - start,
        cached: true,
      }).save();
    } catch (e) {
      console.log(e);
    }
  });

  app.get("/report", async ({ query: { bug } }: Request, res: Response) => {
    await axios.get(
      `https://api.telegram.org/bot${BOT}/sendMessage?chat_id=${ADMIN}&text=${bug}`
    );
    res.json({ message: `Report sent! Thank You` });
  });

  app.get("/import", async ({ query: { icons } }: Request, res: Response) => {
    await new Imp({ date: Date.now(), icons }).save();
    res.json({ icons });
  });

  app.listen(PORT, () => {
    console.log(`Server started at \x1b[36mhttp://localhost:${PORT}\x1b[0m`);
  });
})();
