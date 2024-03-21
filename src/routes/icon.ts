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
      .send(
        `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">${
          color ? icon.replace(/#1C274C/gi, color) : icon
        }</svg>`
      );
  } catch (e) {
    res.status(400).json({ message: `No such icon` });
    console.log(e);
  }
};

export default icon;
