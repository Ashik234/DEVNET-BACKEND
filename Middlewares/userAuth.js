const jwt = require("jsonwebtoken")
require("dotenv").config()

module.exports.userAuthentication = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split("")[1]
        if (!token) {
            res.status(401).json({ auth: false, message: "Token Error" })
        } else {
            jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
                if (err) {
                    res.status(401).json({auth:false,message:"Invalid Token"})
                } else {
                    req.userId = decode.userId
                    next()
                }
            })
        }
    } catch (error) {
        res.staus(500).json({message:error.message})
    }
}