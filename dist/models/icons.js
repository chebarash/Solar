"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const IconsSchema = new mongoose_1.Schema({ icons: Object });
const Icons = (0, mongoose_1.model)("Icons", IconsSchema);
exports.default = Icons;
