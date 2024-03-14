import { Request, Response } from "express";
declare const imp: ({ query: { icons } }: Request, res: Response) => Promise<void>;
export default imp;
