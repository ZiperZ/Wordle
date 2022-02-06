import { useEffect, useState, useRef } from 'react';
import WordleRow from './WordleRow';
import './WordleGame.css';

export default function WordleGame() {
    const [words, setWords] = useState<string[]>(() => {
        const wordsJson = localStorage.getItem(new Date().toDateString());
        if (wordsJson) {
            return JSON.parse(wordsJson);
        }
        else {
            return new Array(6).fill('');
        }
    });
    const [inputEnabled, setInputEnabled] = useState(false);
    const [targetWord, setTargetWord] = useState('');
    const [currentRow, setCurrentRow] = useState(0);
    const [latestWord, setLatestWord] = useState('');
    const currentRowRef = useRef<HTMLDivElement>();

    useEffect(() => {
        fetch('http://localhost:8000/word')
            .then(res => res.json())
            .then(res => {
                let newCurrentRow = words.length;
                for (let i = 0; i < words.length; i++) {
                    if (words[i] === '') {
                        newCurrentRow = i;
                        break;
                    }
                }
                
                console.log(res.word?.toLowerCase());
                setTargetWord(res.word?.toLowerCase());
                setCurrentRow(newCurrentRow);
                if (newCurrentRow !== words.length && res.word?.toLowerCase() !== words[newCurrentRow-1]) {
                    setInputEnabled(true);
                }
            });
    }, []);

    const handleKeyboardInput = (e: KeyboardEvent) => {
        if (e.key === 'Enter' && words[currentRow].length === 5 && words[currentRow] !== latestWord) {
            fetch('http://localhost:8000/does-exist?word=' + words[currentRow])
                .then(res => res.json())
                .then(res => {
                    if (res.isWordPresent) {
                        localStorage.setItem(new Date().toDateString(), JSON.stringify(words));
                        if (currentRow === words.length - 1 || words[currentRow] === targetWord) {
                            localStorage.setItem('winCount', (parseInt(localStorage.getItem('winCount') ?? '0') + 1).toString());
                        }
                        else {
                            setTimeout(() => void setInputEnabled(true), 1180);
                        }
                        setCurrentRow(currentRow => currentRow + 1);
                        setInputEnabled(false);
                    }
                    else {
                        setLatestWord(words[currentRow]);
                        currentRowRef.current?.classList.add('doesnt-exist');
                        setTimeout(() => currentRowRef.current?.classList.remove('doesnt-exist'), 500);
                    }
                });
        }
        else if (e.key === 'Backspace' && words[currentRow].length > 0) {
            setWords([...words.slice(0, currentRow), words[currentRow].slice(0, -1), ...words.slice(currentRow+1)]);
        }
        else if (e.key.length === 1 && words[currentRow].length < 5 && e.key.charCodeAt(0) >= 'a'.charCodeAt(0) && e.key.charCodeAt(0) <= 'z'.charCodeAt(0)) {
            setWords([...words.slice(0, currentRow), words[currentRow] + e.key, ...words.slice(currentRow+1)]);
        }
    };

    useEffect(() => {
        if (inputEnabled) {
            document.addEventListener('keydown', handleKeyboardInput);
            return () => void document.removeEventListener('keydown', handleKeyboardInput);
        }
    }, [words, currentRow, inputEnabled, targetWord]);

    let rowArray = [];
    for (let i = 0; i < words.length; i++) {
        rowArray.push(<WordleRow key={i} completed={ currentRow > i } currentWord={ words[i] } targetWord={ targetWord } />);
    }

    let wordleMessageClassNames = ['wordle-message-container'];
    if (currentRow===words.length || (currentRow-1>=0 && words[currentRow-1] === targetWord))
        wordleMessageClassNames.push('visible');

    let wordleMessageContainer = (
        <div className={ wordleMessageClassNames.join(' ') }>
            <div className="wordle-message">
                <div className="wordle-target-word">
                    { targetWord.toUpperCase() }
                </div>

                <div className="wordle-message-text">
                    { words[Math.min(currentRow-1, words.length-1)] === targetWord ? 'You won, Congrats!' : 'You lost :(' }
                </div>

                <span className="wordle-win-count">
                    Total win count: { localStorage.getItem('winCount') ?? '0' }
                </span>
            </div>
        </div>
    );

    return (
        <div className="wordle-game-container">
            <div className="wordle-header">
                WORDLE
            </div>

            <div className="wordle-board-container">
                { rowArray }
            </div>

            { wordleMessageContainer }

            <button className="wordle-reset-button" onClick={() => { localStorage.clear(); window.location.reload(); }}>Reset personal scores and the board</button>
        </div>
    );
}