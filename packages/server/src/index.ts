import express from 'express';
import path from 'path';
const app = express();
const port = process.env.PORT || 3000;

import router from './routes/v1/router';

app.use(express.json());

app.use(express.static(path.resolve(__dirname, '../client/dist')));

// Routes
app.use('/api/v1', router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

export default app;