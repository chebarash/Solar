import { Schema, model } from "mongoose";
import { ReqType } from "../types/types";

const ReqSchema = new Schema<ReqType>({
  date: Date,
  time: Number,
  cached: Boolean,
});
const Req = model<ReqType>("req", ReqSchema);

export default Req;
