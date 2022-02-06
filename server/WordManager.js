"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WordManager = void 0;
var fs_1 = __importDefault(require("fs"));
var WordManager = /** @class */ (function () {
    function WordManager() {
        this.prevCallTime = new Date();
        this.words = new Set(JSON.parse(fs_1.default.readFileSync('words.json').toString()));
        this.wordIterator = this.words.values();
        this.word = this.wordIterator.next().value;
    }
    WordManager.prototype.getTodaysWord = function () {
        if (new Date().getDay() !== this.prevCallTime.getDay()) {
            this.updateTodaysWord();
        }
        this.prevCallTime = new Date();
        return this.word;
    };
    WordManager.prototype.updateTodaysWord = function () {
        var _a;
        (_a = this.wordIterator) === null || _a === void 0 ? void 0 : _a.next();
        if (this.wordIterator.done) {
            this.wordIterator = this.words.values().next();
        }
    };
    WordManager.prototype.doesWordExist = function (word) {
        return this.words.has(word);
    };
    return WordManager;
}());
exports.WordManager = WordManager;
