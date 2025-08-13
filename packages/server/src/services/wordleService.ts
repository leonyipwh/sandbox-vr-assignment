import { WordList, WordLength, GameRounds } from '../../../shared/config';
import { arraysEqual } from "../utils/arrayUtils";
import { saveResult } from '../services/resultService';

import type { GuessResult } from '../../../shared/wordle.interface';

export class WordleService {
  private candidates: string[] = WordList.map(w => w.toUpperCase());
  private history: Array<{ guess: string, scores: string[] }> = [];
  private gameRound: number = 0;
  private startTime: number = Date.now();
  private endTime: number = 0;
  private roomNumber: string;

  constructor(roomNumber: string) {
    this.roomNumber = roomNumber;
    this.init();
  }

  private init(): void { 
    this.gameRound = 0;
    this.history = [];
    this.candidates = WordList.map(w => w.toUpperCase());
  }

  public guess(guessInput: string): GuessResult { 
    this.gameRound++;
    guessInput = guessInput.toUpperCase();

    // For each candidate, score the guess
    const scores = this.candidates.map(answer => ({
      answer,
      scores: this.scoreGuess(guessInput, answer)
    }));

    // Sort by lowest score
    scores.sort((a, b) => {
      const sa = this.scoreSummary(a.scores);
      const sb = this.scoreSummary(b.scores);
      if (sa.hit !== sb.hit) return sa.hit - sb.hit;
      return sa.present - sb.present;
    });

    // Find candidates with lowest score 
    const minScore = this.scoreSummary(scores[0].scores);
    const minCandidates = scores.filter(s => {
      const ss = this.scoreSummary(s.scores);
      return ss.hit === minScore.hit && ss.present === minScore.present;
    });
    
    // Pick min candidate score
    const randomIndex = Math.floor(Math.random() * minCandidates.length);
    const currentScores = minCandidates[randomIndex].scores;

    // Keep track of history
    this.history.push({ guess: guessInput, scores: currentScores});

    // Filter with history
    this.candidates = this.candidates.filter(candidate => {
      return this.history.every(({ guess, scores }) => {
        return arraysEqual(this.scoreGuess(guess, candidate), scores);
      });
    });

    if (this.isWin(currentScores)) {
      console.log('You win!');
      saveResult({
        roomNumber: this.roomNumber,
        endRound: this.gameRound,
        startTime: this.startTime,
        endTime: Date.now()
      });
      this.init();
    } else if (this.gameRound >= GameRounds) {
      console.log('lost');
      
      this.init();
    }

    return { text: guessInput, scores: currentScores };
  }

  private isWin(scores: string[]): boolean {
    return scores.every(score => score === 'hit');
  }

  private scoreGuess(guess, answer) {
    guess = guess.toUpperCase();
    answer = answer.toUpperCase();
    const result = Array(WordLength).fill('miss');
    const answerArr = answer.split('');
    const guessArr = guess.split('');
    const used = Array(WordLength).fill(false);

    // Check number of HIT
    for (let i = 0; i < WordLength; i++) {
      if (guessArr[i] === answerArr[i]) {
        result[i] = 'hit';
        used[i] = true;
        guessArr[i] = null;
      }
    }
    // Check number of PRESENT
    for (let i = 0; i < WordLength; i++) {
      if (result[i] === 'hit') continue;
      const idx = answerArr.findIndex((ch, j) => ch === guessArr[i] && !used[j]);
      if (idx !== -1 && guessArr[i]) {
        result[i] = 'present';
        used[idx] = true;
      }
    }
    return result;
  }

  // Score HIT and PRESENT
  private scoreSummary(scoreArr) {
    let hit = 0, present = 0;
    for (const s of scoreArr) {
      if (s === 'hit') hit++;
      if (s === 'present') present++;
    }
    return { hit, present };
  }
}
