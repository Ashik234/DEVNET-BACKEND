const userModel = require("../Model/userModel")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Tokenmodel = require("../Model/token")
const sendEmail = require("../utils/nodeMailer")
const crypto = require("crypto")

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
            const emailtoken = await new Token({
                userId: user._id,
                token:crypto.randomBytes(32).toString("hex")
            }).save()
            const url = `${process.env.BASE_URL}users/${user._id}/verify/${emailtoken.token}`
            await sendEmail(user.email,"Verify Email",url)
            return res.status(201).json({ created: true, message: "An Email Sent to your account please verify", token: token });
        }
    } catch (error) {
        console.log(error);
    }
}

const verification = async (req, res) => {
    try {
        const user = await userModel.findOne({_id:req.params.id})
        if (!user) {
            return res.status(400).json({message:"Invalid Link"})
        }
        const token = await Tokenmodel.findOne({
            userId: user._id,
            token:req.params
        })
        if (!token) {
            return res.status(400).json({message:"Invalid Link"})
        }
        await userModel.updateOne({_id:user._id},{$set:{verified:true}})
        await Tokenmodel.deleteOne({ _id: token._id })
        res.status(200).json({message: "Email Verification Successful "})
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "internal server error" });
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
            } else if (!exists.verified) {
                res.status(401).json({message:"please verify your mail by clicking the link sent to your mail",status: false,});
            }
            else {
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