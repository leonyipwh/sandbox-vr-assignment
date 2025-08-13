export const WordleUrl = {
  'START_GAME': '/start',
  'GUESS': '/guess',
  'RANKING': '/ranking'
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
