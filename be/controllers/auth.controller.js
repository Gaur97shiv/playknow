export const signup = (req, res) => {
    const{name, email, password}=req.body;
    const emailRegex= /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)){
        return res.status(400).json({
            message:"Invalid email address"
        })
        
}

export const login = (req, res) => {
    res.status(200).json({
        message:"Login success"
    })
};

export const signout = (req, res) => {
    res.status(200).json({
        message:"Signout success"
    })
};