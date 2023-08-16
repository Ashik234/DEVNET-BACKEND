const userModel = require("../Model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Tokenmodel = require("../Model/token");
const sendEmail = require("../utils/nodeMailer");
const crypto = require("crypto");
const { uploadToCloudinary } = require("../Config/Cloudinary");

const UserReg = async (req, res) => {
  try {
    const { username, email, password, joinedDate, status } = req.body;
    const exists = await userModel.findOne({ email: email });
    if (exists) {
      return res
        .status(200)
        .json({ exists: true, message: "Email already exists" });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedpassword = await bcrypt.hash(password, salt);

      const newUser = new userModel({
        username,
        email,
        password: hashedpassword,
        joinedDate,
        status,
      });
      let user = await newUser.save().then(console.log("Updated"));
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: 6000000,
      });
      const emailtoken = await new Tokenmodel({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
      const url = `${process.env.BASE_URL}/${user._id}/verify/${emailtoken.token}`;
      await sendEmail(user.email, "Verify Email", url);
      return res.status(201).json({
        created: true,
        message: "An Email Sent to your account please verify",
        token: token,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: true, message: error.message });
  }
};

const verification = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.params.id });
    if (!user) {
      return res.status(400).json({ message: "Invalid Link" });
    }
    const token = await Tokenmodel.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) {
      return res.status(400).json({ message: "Invalid Link" });
    }
    const token1 = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: 6000000,
    });
    await userModel.updateOne({ _id: user._id }, { $set: { verified: true } });
    await Tokenmodel.deleteOne({ _id: token._id });
    res
      .status(200)
      .json({ user: user, token1, message: "Email Verification Successful" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error" });
  }
};

const UserLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const exists = await userModel.findOne({ email: email });
    if (exists) {
      const access = await bcrypt.compare(password.toString(), exists.password);
      if (access) {
        const token = jwt.sign({ userId: exists._id }, process.env.JWT_SECRET, {
          expiresIn: 6000000,
        });
        return res.status(200).json({
          user: exists,
          token: token,
          message: "Login Successfull",
          status: true,
        });
      } else if (!exists.verified) {
        res.status(401).json({
          message:
            "Please Verify The Mail By Clicking The Link Sent To Your Mail",
          status: false,
        });
      } else {
        return res
          .status(404)
          .json({ message: "Email or Password is wrong", status: false });
      }
    } else {
      return res
        .status(201)
        .json({ message: "This Email is Not Registered", status: false });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: true, message: error.message });
  }
};

const UserGoogleReg = async (req, res) => {
  try {
    const { name, email, id, picture, status } = req.body;
    const exists = await userModel.findOne({ email: email });
    if (exists) {
      return res
        .status(200)
        .json({ exists: true, message: "Email Already Exists" });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedpassword = await bcrypt.hash(id, salt);

      const newUser = new userModel({
        username: name,
        email: email,
        password: hashedpassword,
        image: picture,
        status,
      });
      let user = await newUser.save().then(console.log("updated"));
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: 6000000,
      });
      return res
        .status(200)
        .json({
          created: true,
          message: "Account Registered",
          token: token,
          user,
        });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: true, message: error.message });
  }
};

const UserGoogleLogin = async (req, res) => {
  try {
    const { email, id } = req.body;
    const exists = await userModel.findOne({ email: email });
    if (exists) {
      const access = await bcrypt.compare(id, exists.password);
      if (access) {
        const token = jwt.sign({ userId: access._id }, process.env.JWT_SECRET, {
          expiresIn: 600000,
        });
        return res.status(200).json({
          user: exists,
          token: token,
          message: "login Successfull",
          status: true,
        });
      } else {
        return res
          .status(404)
          .json({ alert: "Email or Password is wrong", status: false });
      }
    } else {
      return res
        .status(201)
        .json({ alert: "This email is not registered", status: false });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: true, message: error.message });
  }
};

const isUserAuth = async (req, res) => {
  try {
    const userData = await userModel.findOne({ _id: req.userId,status:true });
    if (!userData) {
      return res
        .status(404)
        .json({ message:"user does not exists", data: false });
    } else {
      return res.status(200).json({ data: true, userData: userData });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ data: false });
  }
};

const userGetDetails = async (req, res) => {
  try {
    let userId = req.params.userId;
    const userData = await userModel.findOne({ _id: userId });
    if (!userData)
      return res
        .status(404)
        .json({ success: false, message: "not data found" });
    return res
      .status(200)
      .json({ success: true, message: "data obtained", userData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: "Server Error" });
  }
};

const editProfile = async (req, res) => {
  try {
    const url = req.file.path;
    const { username, github, linkedin, about } = req.body;
    const data = await uploadToCloudinary(url, "profile");
    const image = data.url;
    const id = req.userId;
    const updatedUser = await userModel.findOneAndUpdate(
      { _id: id },
      { username,image, github, linkedin, about },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ success: false, error: "User not found." });
    }
    return res.status(200).json({ success: true, user: updatedUser,message:"Profile Updated" });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Server Error" });
  }
};

module.exports = {
  UserReg,
  UserLogin,
  UserGoogleReg,
  UserGoogleLogin,
  verification,
  isUserAuth,
  userGetDetails,
  editProfile,
};
