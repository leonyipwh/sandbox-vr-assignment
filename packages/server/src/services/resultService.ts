import { Records } from '../models/resultModel';
import { RecordResult } from '../../../shared/wordle.interface';

export const saveResult = (result: RecordResult): void => {
  Records.push(result);
}

export const ranking = () => {
  Records.sort((a, b) => (a.endTime - a.startTime) - (b.endTime - b.startTime));
  return Records.slice(0, 3);
}