import express from 'express';

const profileRouter = express.Router();

profileRouter.get('/', (req, res) => {
  res.send('User profile page');
});

export default profileRouter;