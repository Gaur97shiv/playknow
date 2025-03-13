export const signup = (req, res) => {
    const{name, email, password}=req.body;
    const emailRegex= /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)){
        return res.status(400).json({
            message:"Invalid email address"
        })
        
}

