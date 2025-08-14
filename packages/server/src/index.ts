import express from 'express';
import path from 'path';
const app = express();
const cors = require('cors');

const port = process.env.PORT || 3000;

import router from './routes/v1/router';

app.use(cors());
app.use(express.json());

const clientPath = path.resolve(__dirname, '../../../../client/dist');
app.use(express.static(clientPath));

app.get('/', (req, res) => {
  const indexPath = path.resolve(clientPath, 'index.html');
  res.sendFile(indexPath);
});

// Routes
app.use('/api/v1', router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

export default app;