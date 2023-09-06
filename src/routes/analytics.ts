import { Response } from "express";
import Imp from "../models/imp";
import Req from "../models/req";

const analytics = async (_: any, res: Response) => {
  res.json({ imports: await Imp.find(), requests: await Req.find() });
};

export default analytics;
