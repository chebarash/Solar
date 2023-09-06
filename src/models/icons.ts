import { Schema, model } from "mongoose";
import { IconsType } from "../types/types";

const IconsSchema = new Schema<{ icons: IconsType }>({ icons: Object });
const Icons = model<{ icons: IconsType }>("Icons", IconsSchema);

export default Icons;
