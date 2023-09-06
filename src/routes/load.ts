import { Request, Response } from "express";
import Req from "../models/req";

const load = (data?: boolean) => async (req: Request, res: Response) => {
  try {
    const start = performance.now();

    res.json(data ? req.ico : { ok: true });

    await new Req({
      date: Date.now(),
      time: performance.now() - start,
      cached: false,
    }).save();
  } catch (e) {
    console.log(e);
  }
};

export default load;
