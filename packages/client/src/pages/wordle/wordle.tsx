import React, { useEffect } from 'react';
import './wordle.scss';
import { WordLength, WordList, GameRounds } from '@shared/config.ts';
import toast from 'react-hot-toast';
import { PinInput } from 'react-input-pin-code'

type Score = 'hit' | 'present' | 'miss';
interface GuessResult {
  text: string;
  score: Score
}

function Wordle() {
  const defaultValues = ['', '', '', '', ''];

  const [answer, setAnswer] = React.useState<string>('');
  const [inputValues, setInputValues] = React.useState(defaultValues);
  const [guessResult, setGuessResult] = React.useState<GuessResult[][]>([]);
  const [attempt, setAttempt] = React.useState<number>(0);

  useEffect(() => {
    const answer = WordList[Math.floor(Math.random() * WordList.length)];
    setAnswer(answer);
  }, []);

  useEffect(() => {
    if (attempt >= GameRounds) {
      console.log('Game Over! The answer is:', answer);
    }
  }, [attempt]);

  const keyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (/\d/.test(event.key)) {
      event.preventDefault();
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

    setInputValues(defaultValues);
  };

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
    <>
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
      <div className="form">
        <div className="inputContainer">
          <PinInput size="lg"
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

      <div className="">

      </div>
    </>
  )
}

export default Wordle