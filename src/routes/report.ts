import https from "https";
import { Request, Response } from "express";

const report =
  (BOT: string, ADMIN: string) =>
  async (
    { query: { bug } }: Request<{}, {}, {}, { bug: string }>,
    res: Response
  ) => {
    if (!bug) return res.status(400).json({ message: `Bug required` });

    https
      .get(
        `https://api.telegram.org/bot${BOT}/sendMessage?chat_id=${ADMIN}&text=${encodeURIComponent(
          bug
        )}`
      )
      .on("error", (err) => console.log("Error: " + err.message));

    res.json({ message: `Report sent! Thank You` });
  };

export default report;
