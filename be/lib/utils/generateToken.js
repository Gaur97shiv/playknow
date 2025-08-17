import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "15d",
    });

    res.cookie("AccessToken", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, 
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        secure: process.env.NODE_ENV === "production",
    });
};