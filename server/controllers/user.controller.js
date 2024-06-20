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
        if(password){
            if (password.length < 6) {
                return next(errorHandler(400, 'Password must be at least 6 characters'));
            }
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }

        //update name
        if (name.length < 3) {
            return next(errorHandler(400, 'Name must be at least 3 characters'));
        }
        let updatedUser = await User.updateOne({ _id: user._id }, {
            name,
            password: req.body.password,
            profile_pic: req.body.profile_pic
        })

        // updated user information.
        updatedUser = await User.findById(user._id).select("-password");

        return res.json({
            message: "user update successfully",
            data: updatedUser,
            success: true
        })


    } catch (error) {
        next(errorHandler(400, "failed to update the userrr"));
    }
}



export const searchUser = async (req, res) => {
    try {
        // This extracts the search term from the request body
        const { search } = req.body;

        /*
        "i" is a flag for case-insensitive matching.
        query variable is a regular expression object that will match the search term in a case-insensitive manner across the entire string. for example, if search term is 'john', it can match strings that contain 'john', 'JOHN', 'joHn' etc.
        */
        const query = new RegExp(search, "i");

        const user = await User.find({
            "$or": [
                { name: query },
                { email: query }
            ]
        }).select("-password")

        return res.status(200).json({
            success: true,
            message: 'fetched matching users',
            data: user
        })
    } catch (error) {
        return response.status(500).json({
            success: false,
            message: "failed to search users",
        })
    }
}
