import { User } from "../models/user.model.js";
import bcryptjs from 'bcryptjs'
import { errorHandler } from "../utils/errorHandler.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        if(!name || !email || !password){
            return next(errorHandler(400, "all fields are required"));
        }
        const user = await User.findOne({email});
        if(user){
            return next(errorHandler(400,"user with this email already exist"));
        }

        const hashedPassword = bcryptjs.hashSync(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        })
        await newUser.save();
        return res.status(200).json({
            success: true,
            message: "signup successfull"
        })

    }
    catch (error) {
        return next(errorHandler(401,"signup failed"));
    }

}


export const signin = async (req,res,next) => {
    try {
        const {email, password} = req.body;
        if (!email || !password) {
            return next(errorHandler(400, 'All fields are required'));
        }
        const validUser = await User.findOne({ email });
        if (!validUser) {
            return next(errorHandler(404, 'User not found'));
        }
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) {
            return next(errorHandler(400, 'Invalid password'));
        }

        //authenticate the user.
        const token = jwt.sign(
            {
                id: validUser._id,
            },
            process.env.JWT_SECRET
        )
        // The generated JWT token is a string that contains encoded information about the user.  It can be decoded later to verify the user's identity


        const loggedInUser = await User.findById(validUser._id).select("-password");
        res
        .status(200)

        // Cookies are used to store the JWT (JSON Web Token) generated upon successful authentication.
        .cookie('access_token', token, {httpOnly: true})
        .json({
            success: true,
            message: "signin successfull",
            token,
            loggedInUser
        })
    } 
    catch (error) {
        return next(errorHandler(401,"signin failed"));
    }
}