import React, { useEffect } from 'react';
import { WordLength, WordList, GameRounds } from '@shared/config.ts';
import toast from 'react-hot-toast';
import { PinInput } from 'react-input-pin-code';
import type { GuessResult, Score, RecordResult } from '@shared/wordle.interface';
import './wordle.scss';

import { startGame, guess, getRanking } from "../../services/wordleService.ts";

import Leaderboard from "../../components/leaderboard/leaderboard.tsx";

function Wordle() {
  const defaultValues = Array(WordLength).fill('');

  const [gameOver, setGameOver] = React.useState<boolean>(false);
  const [room, setRoom] = React.useState<string>('');
  const [inputValues, setInputValues] = React.useState<string[]>(defaultValues);
  const [guessResult, setGuessResult] = React.useState<GuessResult[]>([]);
  const [attempt, setAttempt] = React.useState<number>(0);
  const [leaderboard, setLeaderboard] = React.useState<RecordResult[]>([]);
  const [answer, setAnswer] = React.useState<string>('');
  const [blankResult, setBlankResult] = React.useState<number>(GameRounds);

  useEffect(() => {
    init();
    updateLeaderboard();
  }, []);

  useEffect(() => {
    if (attempt >= GameRounds) {
      setGameOver(true);
      toast((t) => (
        <div>
          <p>Game Over 😭</p>
          <p>The answer is <strong>{answer}</strong></p>
          <button onClick={() => {
            toast.dismiss(t.id)
            restartGame();
          }}>
            <p>Restart</p>
          </button>
        </div>
      ), {
        duration: Infinity,
      });
    }

    setBlankResult(GameRounds - attempt);
  }, [attempt]);

  const init = async () => {
    try {
      const response = await startGame();
      if (response.ok) {
        const { roomNumber } = await response.json(); 
        setRoom(roomNumber)
      } else {
        throw new Error('Failed to fetch data');
      }
    } catch (error) {
      errorHandling();
    }
  }

  const updateLeaderboard = async () => {
    try {
      const response = await getRanking();
      if (response.ok) {
        const ranking = await response.json();
        setLeaderboard(ranking);
      }
    } catch {}
  }

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

    checkAnswer(validInput);
  };

  const checkAnswer = async(validInput: string) => {
    let result: GuessResult = { text: validInput, scores: [] };
    try {
      const response = await guess(room, validInput);  
      if (response.ok) {
        result = await response.json();
      }
    } catch (error) {
      errorHandling();
      return;
    }

    if (result.answer) {
      setAnswer(result.answer);
    }

    setGuessResult(currentGuess => [...currentGuess, result]);

    setAttempt(attempt + 1);
  
    if (isWin(result)) {
      setGameOver(true);
      toast((t) => (
        <span>
          👏 Congratulations! You guessed the word!
          <button onClick={() => {
            toast.dismiss(t.id)
            restartGame();
          }}>
            <p>Restart</p>
          </button>
        </span>
      ), {
        duration: Infinity,
      });
    } else {
      setInputValues(defaultValues);
      inputFocus();
    }
  };

  const errorHandling = () => {
    toast.error((t) => (
    <span>
      Somthing went wrong!
      <button onClick={() => {
        toast.dismiss(t.id)
        window.location.reload();
      }}>
        <p>Refresh</p>
      </button>
    </span>
  ), {
    duration: Infinity,
  });
  }

  const inputFocus = () => { 
    const inputEl = document?.getElementById('input-0');
    if (inputEl) {
      (inputEl as HTMLElement).focus();
    }
  }

  const isWin = (result: GuessResult) => result.scores.every(score => score === 'hit');

  const restartGame = () => { 
    setGuessResult([]);
    setAttempt(0);
    setInputValues(defaultValues);
    setGameOver(false);
    setAnswer('');
    inputFocus();
    updateLeaderboard();
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

      <Leaderboard data={leaderboard} />

      <div className="guessResult">
        {
          guessResult.map(({text, scores}, index) => (
            <div className="guessResult__row" key={index}>
              {
                Array.from(scores).map((score, i) => (
                  <div className={'guessResult__letter ' + scoreStyle(score)} key={i}>
                    {text[i].toUpperCase()}
                  </div>
              ))}
            </div>
          ))}
        {
          Array.from({ length: blankResult}).map((_, index) => (
            <div className="guessResult__row" key={index}>
              {
                Array.from({length: WordLength}).map((__, i) => (
                  <div className={'guessResult__blank '} key={i}></div>
              ))}
            </div>
          ))
        }
      </div>

      <div className={"form " + (gameOver ? 'hidden' : '')}>
        <div className="inputContainer">
          <PinInput size="lg"
            id="input"
            placeholder=""
            values={inputValues}
            onKeyDown={keyDown}
            autoFocus
            autoTab
            onChange={(_, __, values) => setInputValues(values.map(v => v.toUpperCase()))}
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
    </div>
  )
}

export default Wordle