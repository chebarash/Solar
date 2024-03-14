"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ImpSchema = new mongoose_1.Schema({ date: Date, icons: Array });
const Imp = (0, mongoose_1.model)("imp", ImpSchema);
exports.default = Imp;
