import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";

export const signup = async (req, res) => {
    const {name, email, password} = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            message: "Invalid email address"
        });
    }

    const existingUser = await User.findOne({name});
    if (existingUser) {
        return res.status(400).json({
            message: "User already exists"
        });
    }

    try {
        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save the user first
        const newUser = new User({
            name, 
            email, 
            password: hashedPassword
        });
        
        const savedUser = await newUser.save();

        if (savedUser) {
            // Generate token only after successful save
            generateTokenAndSetCookie(res, savedUser._id);
            
            return res.status(201).json({
                message: "User created successfully",
                savedUser
            });
          
        }
        else{
            return res.status(400).json({
                message: "User creation failed"
            });
        }   
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

export const login = async (req, res) => {
    const {name, password} = req.body;

    try {
        const user = await User
            .findOne({name});
            if (!user) {
                return res.status(400).json({
                    message: "User not found"
                });
            }
            const passwordMatch = await bcrypt.compare(password, user ?.password|| " ");
            if (!passwordMatch) {
                return res.status(400).json({
                    message: "Invalid credentials"
                });
            }
            generateTokenAndSetCookie(res, user._id);
            return res.status(200).json({
                user
                ,message: "Login successful"
            });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

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
export const checkAuth = async (req, res) => {
    const user = req.user;
    if (user) {
        return res.status(200).json({
            user
        });
    }
}