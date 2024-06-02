import express from 'express';
import profile from "./profile/profile"
import request from './requests/requests';

const user = express.Router();

user.use('/profile', profile);

user.use('/request', request);

export default user;