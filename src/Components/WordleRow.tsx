import './WordleRow.css';

interface WordleRowProps {
    targetWord: string[5],
    currentWord: string,
    completed: boolean,
}

export default function WordleRow(props: WordleRowProps) {
    let tiles = [];
    for (let i = 0; i < 5; i++) {
        const letter = (i < props.currentWord.length) ? props.currentWord[i] : '';
        let classNames = ['wordle-row-tile'];
        if (letter != '') {
            classNames.push('has-letter');
        }
        if (props.completed) {
            if (props.targetWord[i] == letter) {
                classNames.push('correct');
            }
            else if (props.targetWord.includes(letter)) {
                classNames.push('present');
            }
            else {
                classNames.push('absent');
            }
        }

        let style: React.CSSProperties = {
            animationDelay: `${ props.completed ? i * 220 : 0 }ms`
        };

        tiles.push(
            <div key={ i } style={ style } className={ classNames.join(' ') }>
                { letter }
            </div>
        );
    }

    return (
        <div className="wordle-row">
            { tiles }
        </div>
    );
}