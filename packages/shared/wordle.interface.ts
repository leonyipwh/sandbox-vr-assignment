export const WordleUrl = {
  'START_GAME': '/start',
  'GUESS': '/guess',
}

export type Score = 'hit' | 'present' | 'miss';

export interface GuessResult {
  text: string;
  scores: Score[]
}