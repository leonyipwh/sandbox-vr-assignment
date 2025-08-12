import { Router } from 'express';
import {
  startGame,
  guess
} from '../../controllers/wordleController';

const router = Router();

router.get('/', (req, res) => {
  res.send('Hello World!');
});

router.get('/start', startGame);

router.post('/guess', guess);

export default router;