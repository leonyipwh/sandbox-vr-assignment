import { WordleService } from '../services/wordleService';

export interface Room {
  roomNumber: string;
  answer: WordleService;
}

export let rooms: Room[] = [];