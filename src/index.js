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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var cron_1 = require("cron");
var date_fns_1 = require("date-fns");
var client = axios_1.default.create({
    baseURL: 'https://api.productive.io/api/v2',
    headers: {
        'X-Auth-Token': process.env.PRODUCTIVE_API_TOKEN,
        'X-Organization-Id': process.env.PRODUCTIVE_ORGANIZATION_ID,
        'Content-Type': 'application/vnd.api+json'
    }
});
console.log('Hello, World!');
var date = new Date();
var formattedDate = (0, date_fns_1.format)(date, 'yyyy-MM-dd');
var workingDayLength = 8 * 60;
var entries = (await Promise.resolve().then(function () { return require('./entries.json'); })).default;
var job = new cron_1.CronJob('0 17 * * MON-FRI', function () { return __awaiter(void 0, void 0, void 0, function () {
    var response, result, totalTime, entiresTotalTime, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                console.log('Running job...');
                console.log('Today is', formattedDate);
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, client.get('/time_entries', {
                        params: {
                            'filter[after]': formattedDate,
                            'filter[before]': formattedDate
                        }
                    })];
            case 2:
                response = _b.sent();
                result = response.data.data;
                if (result.length > 0) {
                    totalTime = result.reduce(function (acc, entry) { return acc + entry.attributes.time; }, 0);
                    console.log('Entries found, total time is:', totalTime);
                    console.log(result.map(function (entry) { return ({
                        id: entry.id,
                        time: entry.attributes.time,
                        note: entry.attributes.note
                    }); }));
                    if (totalTime < workingDayLength) {
                        insertNewTimeEntry('task_feature', workingDayLength - totalTime);
                    }
                }
                else {
                    console.log('No entries found for today');
                    entiresTotalTime = 0;
                    insertNewTimeEntry('standup');
                    entiresTotalTime += entries['standup'].attributes.time;
                    insertNewTimeEntry('department_standup');
                    entiresTotalTime += entries['department_standup'].attributes.time;
                    insertNewTimeEntry('task_feature', workingDayLength - entiresTotalTime);
                }
                return [3 /*break*/, 4];
            case 3:
                _a = _b.sent();
                console.error('Failed to fetch entries');
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
function insertNewTimeEntry(templateKey, time, note) {
    return __awaiter(this, void 0, void 0, function () {
        var newEntry, _a;
        var _b, _c;
        var _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    newEntry = JSON.parse(JSON.stringify(entries[templateKey]));
                    if (time)
                        (_b = (_d = newEntry.attributes).time) !== null && _b !== void 0 ? _b : (_d.time = time);
                    if (note)
                        (_c = (_e = newEntry.attributes).note) !== null && _c !== void 0 ? _c : (_e.note = note);
                    newEntry.relationships.person.data.id = process.env.PRODUCTIVE_PERSON_ID;
                    newEntry.attributes.date = formattedDate;
                    _f.label = 1;
                case 1:
                    _f.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, client.post('/time_entries', {
                            data: newEntry
                        })];
                case 2:
                    _f.sent();
                    console.log('New time entry inserted', templateKey, time, note);
                    return [3 /*break*/, 4];
                case 3:
                    _a = _f.sent();
                    console.error('Failed to insert new time entry');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
job.start();
