export const WordleUrl = {
  'START_GAME': '/start',
  'GUESS': '/guess',
}

export type Score = 'hit' | 'present' | 'miss';

export interface GuessResult {
  text: string;
  scores: Score[]
}

export interface RecordResult {
  roomNumber: string;
  endRound: number;
  startTime: number;
  endTime: number;
}
