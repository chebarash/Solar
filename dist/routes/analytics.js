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
const imp_1 = __importDefault(require("../models/imp"));
const req_1 = __importDefault(require("../models/req"));
const getData = (res) => {
    const data = {};
    res.forEach(({ date: d }) => {
        const dateClass = new Date(d);
        const year = `${dateClass.getFullYear()}`;
        const month = `${dateClass.getMonth()}`;
        const date = `${dateClass.getDate()}`;
        const hour = `${dateClass.getHours()}`;
        const minute = `${dateClass.getMinutes()}`;
        if (!data[year])
            data[year] = {};
        if (!data[year][month])
            data[year][month] = {};
        if (!data[year][month][date])
            data[year][month][date] = {};
        if (!data[year][month][date][hour])
            data[year][month][date][hour] = {};
        if (!data[year][month][date][hour][minute])
            data[year][month][date][hour][minute] = 0;
        data[year][month][date][hour][minute]++;
    });
    return data;
};
const sortObject = (obj) => Object.entries(obj).sort((a, b) => b[1] - a[1]);
const analytics = (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    const imps = yield imp_1.default.find();
    const reqs = yield req_1.default.find();
    const imported = imps.length;
    const response = parseFloat((reqs.map(({ time }) => time).reduce((a, b) => a + b, 0) / reqs.length).toFixed(2)) || 0;
    const cache = reqs.filter(({ cached }) => cached).length;
    const without = reqs.length - cache;
    const imports = getData(imps);
    const requests = getData(reqs);
    const icons = {};
    const categories = {};
    imps
        .map(({ icons }) => icons)
        .flat()
        .forEach((name) => {
        if (!icons[name])
            icons[name] = 0;
        icons[name]++;
        const category = name.split(` / `)[1];
        if (!categories[category])
            categories[category] = 0;
        categories[category]++;
    });
    res.json({
        imported,
        response,
        cache,
        without,
        imports,
        requests,
        icons: sortObject(icons),
        categories: sortObject(categories),
    });
});
exports.default = analytics;
