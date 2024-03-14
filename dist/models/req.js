"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ReqSchema = new mongoose_1.Schema({
    date: Date,
    time: Number,
    cached: Boolean,
});
const Req = (0, mongoose_1.model)("req", ReqSchema);
exports.default = Req;
