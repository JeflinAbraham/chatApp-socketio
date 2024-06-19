import express from 'express'
import { searchUser, signout, updateUser, userDetails } from '../controllers/user.controller.js';

const router = express.Router();
router.get('/user-details', userDetails);
router.post('/sign-out', signout)
router.post('/update-user', updateUser);
router.post('/search-users', searchUser);

export default router;