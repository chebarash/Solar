"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = require("mongoose");
const icons_1 = __importDefault(require("./models/icons"));
const load_1 = __importDefault(require("./routes/load"));
const report_1 = __importDefault(require("./routes/report"));
const icon_1 = __importDefault(require("./routes/icon"));
const import_1 = __importDefault(require("./routes/import"));
const analytics_1 = __importDefault(require("./routes/analytics"));
const update_1 = __importDefault(require("./routes/update"));
dotenv_1.default.config();
const { APP_PORT, BOT, ADMIN, DB_CONNECTION_STRING } = process.env;
if (!APP_PORT || !BOT || !ADMIN || !DB_CONNECTION_STRING) {
    console.error(`Environment Variables not set`);
    process.exit(1);
}
let ico;
const app = (0, express_1.default)();
app.use(body_parser_1.default.json({ limit: "50mb" }));
app.use(body_parser_1.default.urlencoded({ limit: "50mb", extended: true }));
app.use((0, cors_1.default)());
app.use(express_1.default.static(`public`));
app.post(`/${BOT}`, update_1.default);
app.get(`/report`, report_1.default);
app.get(`/analytics`, analytics_1.default);
app.use((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!ico) {
        const data = yield icons_1.default.findOne();
        if (data)
            ico = data.icons;
    }
    if (!ico)
        return res
            .status(400)
            .json({ message: `Sorry, we couldn't run the plugin!` });
    req.ico = ico;
    req.updIco = (icons) => (ico = icons);
    return next();
}));
app.get(`/data`, (0, load_1.default)(true));
app.get(`/load`, (0, load_1.default)());
app.get(`/import`, import_1.default);
app.get(`/icon`, icon_1.default);
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, mongoose_1.connect)(DB_CONNECTION_STRING);
    app.listen(APP_PORT, () => console.log(`Server started at ${APP_PORT}`));
}))();
