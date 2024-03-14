import { Response } from "express";
declare const analytics: (_: any, res: Response) => Promise<void>;
export default analytics;
