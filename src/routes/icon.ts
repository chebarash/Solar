import { Request, Response } from "express";
import { IconReqType } from "../types/types";

const icon = async (
  {
    ico,
    query: { category, name, style, color },
  }: Request<{}, {}, {}, IconReqType>,
  res: Response
) => {
  try {
    const icon = ico[category][name][style];

    res
      .setHeader("content-type", "image/svg+xml")
      .send(color ? icon.replace(/#1C274C/gi, color) : icon);
  } catch (e) {
    res.status(400).json({ message: `No such icon` });
    console.log(e);
  }
};

export default icon;
