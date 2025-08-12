export type Score = 'hit' | 'present' | 'miss';

export interface GuessResult {
  text: string;
  score: Score
}