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
        )}`,
        (resp) =>
          resp.on("end", () => res.json({ message: `Report sent! Thank You` }))
      )
      .on("error", (err) => console.log("Error: " + err.message));
  };

export default report;
