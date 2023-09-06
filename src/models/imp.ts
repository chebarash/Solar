import { Schema, model } from "mongoose";
import { ImpType } from "../types/types";

const ImpSchema = new Schema<ImpType>({ date: Date, icons: Array });
const Imp = model<ImpType>("imp", ImpSchema);

export default Imp;
