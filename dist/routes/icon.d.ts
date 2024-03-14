import { Request, Response } from "express";
import { IconReqType } from "../types/types";
declare const icon: ({ ico, query: { category, name, style, color }, }: Request<{}, {}, {}, IconReqType>, res: Response) => Promise<void>;
export default icon;
