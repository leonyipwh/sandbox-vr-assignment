import { v4 as uuid } from 'uuid';
import { Room, rooms } from '../models/roomModel';
import { WordleService } from "../services/wordleService";
import { ranking } from "../services/resultService";

export const startGame = (req, res) => {
  const roomNumber = uuid();
  const newRoom: Room = { roomNumber, answer: new WordleService(roomNumber) };
  
  rooms.push(newRoom);
  res.send({
    roomNumber,
  });
}

export const guess = (req, res) => { 
  const { roomNumber, guess } = req.body;
  const room = rooms.find(r => r.roomNumber === roomNumber) as Room;

  if (!room) {
    return res.status(404).send({ error: 'Room not found' });
  }

  const result = room.answer.guess(guess);

  return res.status(200).json(result);
}

export const getRanking = (req, res) => {
  return res.send(ranking());
}