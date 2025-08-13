import { WordList } from '../../../shared/config';
import type { Score, GuessResult } from '../../../shared/wordle.interface';

export class AnswerService {
  private answer: string;

  constructor() {
    this.answer = this.pickAnswer();
  }

  private pickAnswer(): string {
    return WordList[Math.floor(Math.random() * WordList.length)];
  }

  public getAnswer(): string {
    return this.answer;
  }

  public checkGuess(guessInput: string): GuessResult { 
    const scoreArray: Score[] = [];

    Array.from(guessInput).map((letter, index) => {
      let score: Score = 'miss';
      const answer = this.getAnswer();
      const text = letter.toUpperCase();
      const upperCaseAnswer = answer.toUpperCase();

      if (text === upperCaseAnswer[index]) {
        score = 'hit';
      }

      if (text !== upperCaseAnswer[index] && upperCaseAnswer.includes(text)) {
        score = 'present';
      }

      scoreArray.push(score);
    });

    return { text: guessInput, scores: scoreArray };
  }

  public resetAnswer(): void {
    this.answer = this.pickAnswer();
  }
}
