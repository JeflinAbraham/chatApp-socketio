import express from 'express'
import { signout, updateUser, userDetails } from '../controllers/user.controller.js';

const router = express.Router();
router.get('/user-details', userDetails);
router.post('/sign-out', signout)
router.post('/update-user', updateUser);

export default router;