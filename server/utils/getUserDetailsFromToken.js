import jwt from 'jsonwebtoken'
import { User } from '../models/user.model.js'

export const getUserDetailsFromToken = async (token) => {
    const decode = jwt.verify(token,process.env.JWT_SECRET);
    const user = await User.findById(decode.id).select('-password');
    return user;
}
