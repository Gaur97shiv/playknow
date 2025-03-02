export const signup = (req, res) => {
    res.status(200).json({
        message:"Signup success"
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