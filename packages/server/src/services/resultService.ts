import { Records } from '../models/resultModel';
import { RecordResult } from '../../../shared/wordle.interface';

export const saveResult = (result: RecordResult): void => {
  Records.push(result);
}

export const ranking = () => {
  return Records.sort((a, b) => (b.endTime - b.startTime) - (a.endTime - a.startTime));
}