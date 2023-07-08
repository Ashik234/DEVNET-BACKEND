const adminModel = require("../Model/adminModel")
const jwt = require("jsonwebtoken")

const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        const admin = await adminModel.findOne({ email: email })
        if (!admin) {
            return   res.status(404).json({message:"invalid email",login:false})
        }
        if (password !== admin.password) {
            return res.status(401).json({message:"Invalid Password",login:false})
        }
        const token = jwt.sign({id:admin._id},process.env.JWT_SECRET,{expiresIn:300000})
        res.status(200).json({login:true,message:"Login Successfull",token:token})
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error:erro.message,login:FontFaceSetLoadEvent})
    }
}

module.exports = {
    adminLogin
}