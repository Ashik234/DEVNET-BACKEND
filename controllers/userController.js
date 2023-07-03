const userModel = require("../Model/userModel")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const UserReg = async (req, res) => {
    try {
        const { username,email,password } = req.body
        const exists = await userModel.findOne({ email: email })
        if (exists) {
            return res.status(200).json({ exists: true, message: "email already exists" });
        } else {

            const salt = await bcrypt.genSalt(10)
            const hashedpassword = await bcrypt.hash(password, salt)
            
            const newUser = new userModel({
                username,
                email,
                password:hashedpassword
            })
            let user = await newUser.save().then(console.log("updated"))
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1m' });
            return res.status(200).json({ created: true, message: "Account Registered",token:token  });
        }
    } catch (error) {
        console.log(error);
    }
}

const UserLogin = async (req, res)=> {
    try {
        const{email,password}=req.body
        const exists = await userModel.findOne({email:email})
        if(exists){
            const access = await bcrypt.compare(password.toString(),exists.password)
            if(access){
                const token = jwt.sign({ userId: access._id }, process.env.JWT_SECRET, { expiresIn: '1m' });
                return res.status(200).json({ user:exists,token:token, message:"login" ,status:true})
            }else{
                return res.status(404).json({alert:"Email or Password is wrong",status:false})
            }
        }else{
         return res.status(201).json({alert:"This email is not registered",status:false})
        }
    } catch (error) {
        console.log(error);
    }
}

const UserGoogleReg = async (req, res) => {
    try {
        const { name,email,id,picture } = req.body
        const exists = await userModel.findOne({ email: email })
        if (exists) {
            return res.status(200).json({ exists: true, message: "email already exists" });
        } else {

            const salt = await bcrypt.genSalt(10)
            const hashedpassword = await bcrypt.hash(id, salt)
            
            const newUser = new userModel({
                username:name,
                email:email,
                password: hashedpassword,
                image:picture
            })
            let user = await newUser.save().then(console.log("updated"))
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1m' });
            return res.status(200).json({ created: true, message: "Account Registered",token:token  });
        }
    } catch (error) {
        console.log(error);
    }
}

const UserGoogleLogin = async (req, res) => {
    try {
        const{email,id}=req.body
        const exists = await userModel.findOne({email:email})
        if(exists){
            const access = await bcrypt.compare(id,exists.password)
            if(access){
                const token = jwt.sign({ userId: access._id }, process.env.JWT_SECRET, { expiresIn: '1m' });
                return res.status(200).json({ user:exists,token:token, message:"login" ,status:true})
            }else{
                return res.status(404).json({alert:"Email or Password is wrong",status:false})
            }
        } else {
            console.log("account not registered");
         return res.status(201).json({alert:"This email is not registered",status:false})
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports= {
    UserReg,
    UserLogin,
    UserGoogleReg,
    UserGoogleLogin
}