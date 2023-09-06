import axios from "axios";
import { Request, Response } from "express";

const { BOT, ADMIN } = process.env;

const report = async (
  { query: { bug } }: Request<{}, {}, {}, { bug: string }>,
  res: Response
) => {
  if (!bug) return res.status(400).json({ message: `Bug required` });

  await axios.get(
    `https://api.telegram.org/bot${BOT}/sendMessage?chat_id=${ADMIN}&text=${encodeURIComponent(
      bug
    )}`
  );

  res.json({ message: `Report sent! Thank You` });
};

export default report;
