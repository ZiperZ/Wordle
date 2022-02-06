import fs from 'fs';
import path from 'path';

export class WordManager {
    prevCallTime: Date;
    word: string;
    words: Set<string>;
    wordIterator: any;

    constructor() {
        this.prevCallTime = new Date();
        this.words = new Set(JSON.parse(fs.readFileSync('words.json').toString()));
        this.wordIterator = this.words.values();
        this.word = this.wordIterator.next().value;
    }

    getTodaysWord() {
        if (new Date().getDay() !== this.prevCallTime.getDay()) {
            this.updateTodaysWord();
        }
        this.prevCallTime = new Date();
        return this.word;
    }

    updateTodaysWord() {
        this.wordIterator?.next();
        if (this.wordIterator.done) {
            this.wordIterator = this.words.values().next();
        }
    }

    doesWordExist(word: string) {
        return this.words.has(word);
    }
}