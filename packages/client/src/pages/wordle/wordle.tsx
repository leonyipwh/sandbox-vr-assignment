// import { GameRounds } from "@shared/config.ts";
import React from 'react';
import './wordle.scss';
import { WordLength } from '@shared/config.ts';

import { PinInput } from 'react-input-pin-code'

type Score = 'hit' | 'present' | 'miss';
interface GuessResult {
  text: string;
  score: Score
}

function Wordle() {
  const defaultValues = ['', '', '', '', ''];

  const [inputValues, setInputValues] = React.useState(defaultValues);
  const [guessResult, setGuessResult] = React.useState<GuessResult[][]>([]);
  // console.log(GameRounds);

  const keyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (/\d/.test(event.key)) {
      event.preventDefault();
    }
  };

  const formSubmit = () => {
    const validInput = inputValues.filter(Boolean);

    if (validInput.length !== WordLength) {
      return;
    }

    const answer = 'HELLO';

    checkAnswer(validInput, answer);
  };

  const checkAnswer = (validInput: string[], answer: string) => {
    const result: GuessResult[]= [];
    validInput.map((letter, index) => {
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
    </>
  )
}

export default Wordle