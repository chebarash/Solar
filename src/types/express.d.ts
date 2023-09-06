import { IconsType } from "./types";

declare global {
  namespace Express {
    interface Request {
      ico: IconsType;
    }
  }
}
