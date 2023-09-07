import { Response } from "express";
import Imp from "../models/imp";
import Req from "../models/req";

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

const analytics = async (_: any, res: Response) => {
  const imports = await Imp.find();
  const requests = await Req.find();

  const importsData = getData(imports);
  const requestsData = getData(requests);

  res.json({ imports, requests, importsData, requestsData });
};

export default analytics;
