import { User } from "../models/user.model.js";
import { errorHandler } from "../utils/errorHandler.js";
import { getUserDetailsFromToken } from "../utils/getUserDetailsFromToken.js";
import bcryptjs from 'bcryptjs';

export const userDetails = async (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        return next(errorHandler(400, "token not found with cookies, not authenticated"));
    }
    const userInfo = await getUserDetailsFromToken(token);
    res.status(200).json({
        success: true,
        userInfo
    })
}


export const signout = (req, res, next) => {
    try {
        res
            .clearCookie('access_token')
            .status(200)
            .json({
                success: true,
                message: "signout successfull"
            });
    } catch (error) {
        return next(error);
    }
};


export const updateUser = async (req, res, next) => {
    try {
        const token = req.cookies.access_token;
        if (!token) {
            return next(errorHandler(400, "token not found with cookies, not authenticated"));
        }
        const user = await getUserDetailsFromToken(token)

        const { name, password, profile_pic } = req.body;

        //update password
        if (password.length < 6) {
            return next(errorHandler(400, 'Password must be at least 6 characters'));
        }
        const hashedPassword = bcryptjs.hashSync(password, 10);

        //update name
        if (name.length < 3) {
            return next(errorHandler(400, 'Name must be at least 3 characters'));
        }
        let updatedUser = await User.updateOne({ _id : user._id },{
            name,
            password: hashedPassword,
            profile_pic
        })

        // updated user information.
        updatedUser = await User.findById(user._id).select("-password");

        return res.json({
            message: "user update successfully",
            data: updatedUser,
            success: true
        })


    } catch (error) {
        next(errorHandler(400, "failed to update the user"));
    }
}
