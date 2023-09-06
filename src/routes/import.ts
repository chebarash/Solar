import { Request, Response } from "express";
import Imp from "../models/imp";

const imp = async ({ query: { icons } }: Request, res: Response) => {
  await new Imp({ date: Date.now(), icons }).save();
  res.json({ icons });
};

export default imp;
