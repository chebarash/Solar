import { Response } from "express";

import Imp from "../models/imp";
import Req from "../models/req";

import { TopType } from "../types/types";

const getData = (res: Array<{ date: Date }>) => {
  const data: {
    [year: string]: {
      [month: string]: {
        [date: string]: { [hour: string]: { [minute: string]: number } };
      };
    };
  } = {};

  res.forEach(({ date: d }) => {
    const dateClass = new Date(d);
    const year = `${dateClass.getFullYear()}`;
    const month = `${dateClass.getMonth()}`;
    const date = `${dateClass.getDate()}`;
    const hour = `${dateClass.getHours()}`;
    const minute = `${dateClass.getMinutes()}`;

    if (!data[year]) data[year] = {};
    if (!data[year][month]) data[year][month] = {};
    if (!data[year][month][date]) data[year][month][date] = {};
    if (!data[year][month][date][hour]) data[year][month][date][hour] = {};
    if (!data[year][month][date][hour][minute])
      data[year][month][date][hour][minute] = 0;
    data[year][month][date][hour][minute]++;
  });

  return data;
};

const sortObject = (obj: TopType) =>
  Object.entries(obj).sort((a, b) => b[1] - a[1]);

const analytics = async (_: any, res: Response) => {
  const imps = await Imp.find();
  const reqs = await Req.find();

  const imported = imps.length;
  const response =
    parseFloat(
      (
        reqs.map(({ time }) => time).reduce((a, b) => a + b, 0) / reqs.length
      ).toFixed(2)
    ) || 0;
  const cache = reqs.filter(({ cached }) => cached).length;
  const without = reqs.length - cache;

  const imports = getData(imps);
  const requests = getData(reqs);

  const icons: TopType = {};
  const categories: TopType = {};

  imps
    .map(({ icons }) => icons)
    .flat()
    .forEach((name) => {
      if (!icons[name]) icons[name] = 0;
      icons[name]++;
      const category = name.split(` / `)[1];
      if (!categories[category]) categories[category] = 0;
      categories[category]++;
    });

  res.json({
    imported,
    response,
    cache,
    without,
    imports,
    requests,
    icons: sortObject(icons),
    categories: sortObject(categories),
  });
};

export default analytics;
