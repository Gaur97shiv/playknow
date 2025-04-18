import User from "../models/user.model.js";
import jwt from "jsonwebtoken";


export const protectedRoute = async (req, res, next) => {
    try {
        const token = req.cookies.AccessToken;
        if (!token) {
            return res.status(401).json({
            error: "You need to login first"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("decoded", decoded)
        if (!decoded) {
            return res.status(401).json({
                error: "Invalid token"
            });
        }

        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({
                error: "User not found"
            });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error("Error in protectedRoute middleware:", error);
        return res.status(500).json({
            error: "Internal Server Error"
        });
    }
};