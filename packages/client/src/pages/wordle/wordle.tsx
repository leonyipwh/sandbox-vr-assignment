// import { GameRounds } from "@shared/config.ts";
import './wordle.scss';

function Wordle() {
  // console.log(GameRounds);

  const guesses: string[] = [
    'apple',
    'grape'
  ];

  return (
    <>
      <div>
        {
          guesses.map((guess, index) => (
            <div className="guessResult" key={index}>
              {
                Array.from(guess).map((letter, i) => (
                  <div key={i}>
                    {letter}
                  </div>
              ))}
            </div>
        ))}
      </div>
    </>
  )
}

export default Wordle