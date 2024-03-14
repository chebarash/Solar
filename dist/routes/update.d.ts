import { Request, Response } from "express";
import { IconsType } from "../types/types";
declare const update: ({ body: icons, updIco }: Request<{}, {}, IconsType>, res: Response) => Promise<void>;
export default update;
