import express from 'express';

const request = express.Router();

request.get('/', (req, res) => {
  res.send('Request ABC page');
});

export default request;