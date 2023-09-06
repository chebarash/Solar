import { Request, Response } from "express";
import Icons from "../models/icons";
import { IconsType } from "../types/types";

const update = async (
  { body: { icons } }: Request<{}, {}, { icons: IconsType }>,
  res: Response
) => {
  await Icons.deleteMany({});
  await new Icons({ icons }).save();
  res.json({ ok: true });
};

export default update;
