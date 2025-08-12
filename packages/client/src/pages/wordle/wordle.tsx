// import { GameRounds } from "@shared/config.ts";
import React from 'react';
import './wordle.scss';
import { WordLength } from '@shared/config.ts';

import { PinInput } from 'react-input-pin-code'

function Wordle() {
  const defaultValues = ['', '', '', '', ''];

  const [inputValues, setInputValues] = React.useState(defaultValues);
  const [guessResult, setGuessResult] = React.useState<string[]>([]);
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

    setGuessResult(currentGuess => [...currentGuess, validInput.join('').toUpperCase()]);
    setInputValues(defaultValues);
  };

  return (
    <>
      <div className="guessResult">
        {
          guessResult.map((guess, index) => (
            <div className="guessResult__row" key={index}>
              {
                Array.from(guess).map((letter, i) => (
                  <div key={i}>
                    {letter}
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
            onChange={(value, index, values) => setInputValues(values)}
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