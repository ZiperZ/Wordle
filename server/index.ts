import express from 'express';
import cors from 'cors';
import { WordManager } from './WordManager';

// initialize the express app
const app = express();
app.use(cors({
    origin: '*'
}));

const wordManager = new WordManager();

app.get('/word', (req, res) => {
    res.status(200).json({ word: wordManager.getTodaysWord() });
});

app.get('/does-exist', (req, res) => {
    const word = req.query.word?.toString();
    if (word && word.length == 5) {
        const capitalizedWord = word[0].toUpperCase() + word.slice(1);
        res.status(200).json({ isWordPresent: wordManager.doesWordExist(capitalizedWord) });
    }
    else {
        res.status(400).json({ error: 'Word is required.' });
    }
});

app.listen(process.env['PORT'] ?? 8000);