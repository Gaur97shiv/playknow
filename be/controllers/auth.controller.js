import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";

export const signup = async (req, res) => {
    const {name, email, password} = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            message: "Invalid email address"
        });
    }

    const existingUser = await User.findOne({email});
    if (existingUser) {
        return res.status(400).json({
            message: "User already exists"
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });
        generateTokenAndSetCookie(res, newUser._id);
        const savedUser = await newUser.save();
            return res.status(201).json({
                message: "User created successfully",
                savedUser
            });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

export const login = async (req, res) => {
    const { name, password } = req.body;

    if (!name || !password) {
        return res.status(400).json({
            message: "Name and password are required"
        });
    }

    try {
        const user = await User.findOne({ name });
        if (!user) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }
        const passwordMatch = await bcrypt.compare(password, user.password || "");
        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }
        generateTokenAndSetCookie(res, user._id);

        // Remove sensitive info before sending user object
        const { password: pwd, ...userWithoutPassword } = user.toObject();

        return res.status(200).json({
            user: userWithoutPassword,
            message: "Login successful"
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

export const logout = async (req, res) => {
   try{
           res.cookie("AccessToken", "", {maxAge: 0});
           return res.status(200).json({
               message: "Logout successful"
           });
   }catch(error){
         return res.status(500).json({
              message: "Internal server error",
              error: error.message
   })
}
}

export const getMe = async (req, res) => {
	try {
		const user = await User.findById(req.user._id).select("-password");
		res.status(200).json(user);
	} catch (error) {
		console.log("Error in getMe controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};