import React, { useEffect } from 'react';
import { WordLength, WordList, GameRounds } from '@shared/config.ts';
import toast from 'react-hot-toast';
import { PinInput } from 'react-input-pin-code'
import './wordle.scss';

type Score = 'hit' | 'present' | 'miss';
interface GuessResult {
  text: string;
  score: Score
}

function Wordle() {
  const defaultValues = Array(WordLength).fill('');

  const [gameOver, setGameOver] = React.useState<boolean>(false);
  const [answer, setAnswer] = React.useState<string>('');
  const [inputValues, setInputValues] = React.useState(defaultValues);
  const [guessResult, setGuessResult] = React.useState<GuessResult[][]>([]);
  const [attempt, setAttempt] = React.useState<number>(0);

  useEffect(() => {
    pickAnswer();
  }, []);

  useEffect(() => {
    if (attempt >= GameRounds) {
      setGameOver(true);
      toast((t) => (
        <span>
          Game Over! The answer is: {answer}
          <button onClick={() => {
            toast.dismiss(t.id)
            restartGame();
          }}>
            Restart
          </button>
        </span>
      ), {
        icon: '😭',
        duration: Infinity,
      });
    }
  }, [attempt]);

  const keyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (/\d/.test(event.key)) {
      event.preventDefault();
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      formSubmit();
    }
  };

  const formSubmit = () => {
    const validInput = inputValues.filter(Boolean).join('').toUpperCase();

    if (validInput.length !== WordLength) {
      return;
    }

    if (!WordList.includes(validInput)) {
      toast.error('Invalid word');
      return;
    }

    checkAnswer(validInput, answer);
  };

  const checkAnswer = (validInput: string, answer: string) => {
    const result: GuessResult[]= [];
    Array.from(validInput).map((letter, index) => {
      let score: Score = 'miss';
      const text = letter.toUpperCase();
      const upperCaseAnswer = answer.toUpperCase();

      if (text === upperCaseAnswer[index]) {
        score = 'hit';
      }

      if (text !== upperCaseAnswer[index] && upperCaseAnswer.includes(text)) {
        score = 'present';
      }

      result.push({
        text,
        score,
      });
    });

    setGuessResult(currentGuess => [...currentGuess, result]);

    setAttempt(attempt + 1);

    if (isWin(result)) {
      setGameOver(true);
      toast((t) => (
        <span>
          Congratulations! You guessed the word!
          <button onClick={() => {
            toast.dismiss(t.id)
            restartGame();
          }}>
            Restart
          </button>
        </span>
      ), {
        icon: '👏',
        duration: Infinity,
      });
    }

    setInputValues(defaultValues);
    inputFocus();
  };

  const inputFocus = () => { 
    const inputEl = document?.getElementById('input-0');
    if (inputEl) {
      (inputEl as HTMLElement).focus();
    }
  }

  const isWin = (result: GuessResult[]) => result.every(item => item.score === 'hit');

  const restartGame = () => { 
    setGuessResult([]);
    setAttempt(0);
    pickAnswer();
    setInputValues(defaultValues);
    setGameOver(false);
    inputFocus();
  }

  const pickAnswer = () => { 
    const answer = WordList[Math.floor(Math.random() * WordList.length)];
    setAnswer(answer);
  }

  const scoreStyle = (score: Score) => {
    switch (score) {
      case 'hit':
        return 'guessResult__letter--hit';
      case 'present':
        return 'guessResult__letter--present';
      case 'miss':
        return 'guessResult__letter--miss';
      default:
        return '';
    }
  };

  return (
    <div className='wordle'>
      <div className="guessResult">
        {
          guessResult.map((guess, index) => (
            <div className="guessResult__row" key={index}>
              {
                Array.from(guess).map((item, i) => (
                  <div className={'guessResult__letter ' + scoreStyle(item.score)} key={i}>
                    {item.text}
                  </div>
              ))}
            </div>
        ))}
      </div>
      {!gameOver &&
        <div className="form">
          <div className="inputContainer">
            <PinInput size="lg"
              id="input"
              placeholder=""
              values={inputValues}
              onKeyDown={keyDown}
              autoFocus
              autoTab
              onChange={(value, index, values) => setInputValues(values.map(v => v.toUpperCase()))}
            />
          </div>

            <button className="submitButton" onClick={formSubmit}>
              {
                inputValues.filter(Boolean).length === 5 ?  
                  <p> Submit</p> :
                  <p>Make a guess</p>
              }
              </button>
        </div>
      }

    </div>
  )
}

export default Wordle