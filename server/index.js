"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var WordManager_1 = require("./WordManager");
// initialize the express app
var app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: '*'
}));
var wordManager = new WordManager_1.WordManager();
app.get('/word', function (req, res) {
    res.status(200).json({ word: wordManager.getTodaysWord() });
});
app.get('/does-exist', function (req, res) {
    var _a;
    var word = (_a = req.query.word) === null || _a === void 0 ? void 0 : _a.toString();
    if (word && word.length == 5) {
        var capitalizedWord = word[0].toUpperCase() + word.slice(1);
        res.status(200).json({ isWordPresent: wordManager.doesWordExist(capitalizedWord) });
    }
    else {
        res.status(400).json({ error: 'Word is required.' });
    }
});
app.listen((_a = process.env['PORT']) !== null && _a !== void 0 ? _a : 8000);
