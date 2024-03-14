import { Request, Response } from "express";
declare const load: (data?: boolean) => (req: Request, res: Response) => Promise<void>;
export default load;
