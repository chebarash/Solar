import { Request, Response } from "express";
declare const report: ({ query: { bug } }: Request<{}, {}, {}, {
    bug: string;
}, Record<string, any>>, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export default report;
