import { v4 as uuid } from 'uuid';
import { Room, rooms } from '../models/roomModel';
import { AnswerService } from "../services/answerService";

export const startGame = (req, res) => {
  const roomNumber = uuid();
  const newRoom: Room = { roomNumber, answer: new AnswerService() };
  
  rooms.push(newRoom);
  res.send({
    roomNumber
  });
}

export const guess = (req, res) => { 
  const { roomNumber, guess } = req.body;
  const room = rooms.find(r => r.roomNumber === roomNumber);

  if (!room) {
    return res.status(404).send({ error: 'Room not found' });
  }

  const result = room.answer.checkGuess(guess);

  return res.status(200).json(result);
}