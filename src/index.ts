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
const lim = 100;

const urls: { [id: string]: string } = {};

let loaded = 0;

const IconsSchema = new Schema<{ icons: IconsType }>({ icons: Object });
const Icons = model<{ icons: IconsType }>("Icons", IconsSchema);

const ReqSchema = new Schema<ReqType>({ date: Date, time: Number });
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

const toStr = (text: string) =>
  text.toLocaleLowerCase().replace(/[-_]+/g, "").replace(/ /g, "");

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

  app.get(
    "/data",
    async (
      {
        query: { page = `0`, categories = [], search = `` },
      }: { query: { page: string; categories: Array<string>; search: string } },
      res: Response
    ) => {
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

        const pageInt = parseInt(page);
        const filteredSearch = toStr(search);
        let num = 0;

        const filteredIcons = Object.entries(ico)
          .filter(([category]) =>
            categories.length ? categories.includes(category) : true
          )
          .map(([c, n]) => [
            c,
            Object.fromEntries(
              Object.entries(n).filter(([name]) =>
                filteredSearch.length
                  ? toStr(name).includes(filteredSearch)
                  : true
              )
            ),
          ]);

        const lenArray = filteredIcons.map(([_n, v]) => Object.keys(v).length);

        const len = lenArray.length ? lenArray.reduce((a, b) => a + b) : 0;

        res.json({
          icons: Object.fromEntries(
            filteredIcons.map(([c, l]) => {
              let s = lim * pageInt - num;
              let e = lim * pageInt - num + lim;
              if (s < 0) s = 0;
              if (e < 0) e = 0;
              const li = Object.fromEntries(Object.entries(l).slice(s, e));
              num += Object.keys(l).length;
              return [c, li];
            })
          ),
          categories: Object.keys(ico).map((name) => ({
            name,
            icon: Object.values(ico[name])[0],
            length: Object.values(ico[name]).length,
          })),
          search,
          prev: !!pageInt,
          next: len > pageInt * lim + lim,
          len,
        });
        await new Req({
          date: Date.now(),
          time: performance.now() - start,
        }).save();
      } catch (e) {
        console.log(e);
      }
    }
  );

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
