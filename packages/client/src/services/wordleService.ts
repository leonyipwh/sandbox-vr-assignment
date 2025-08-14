import { WordleUrl } from "@shared/wordle.interface";

export const startGame = async () => {
  return fetch(`${import.meta.env.VITE_SERVER_URL}${WordleUrl.START_GAME}`);
}

export const guess = async (roomNumber:string, guess: string) => {
  const option = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      roomNumber,
      guess
    }),
  };

  return fetch(`${import.meta.env.VITE_SERVER_URL}${WordleUrl.GUESS}`, option);
}

export const getRanking = async () => {
  return fetch(`${import.meta.env.VITE_SERVER_URL}${WordleUrl.RANKING}`);
}