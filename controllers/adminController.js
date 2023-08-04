const adminModel = require("../Model/adminModel");
const userModel = require("../Model/userModel");
const eventModel = require("../Model/eventModel");
const communityModel = require("../Model/communityModel");
const reportModel = require("../Model/reportModel");
const jwt = require("jsonwebtoken");
const questionModel = require("../Model/questionModel");

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await adminModel.findOne({ email: email });
    if (!admin) {
      return res.status(404).json({ message: "invalid email", login: false });
    }
    if (password !== admin.password) {
      return res
        .status(401)
        .json({ message: "Invalid Password", login: false });
    }
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: 300000,
    });
    res
      .status(200)
      .json({ login: true, message: "Login Successfull", token: token });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: erro.message });
  }
};

const isAdminAuth = async (req, res) => {
  try {
    const adminData = await adminModel.findOne({ _id: req.adminId });
    if (!adminData) {
      return res
        .status(404)
        .json({ message: "Authentication Failed", success: false });
    } else {
      return res.status(200).json({ success: true, adminData: adminData });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
};

const userDetails = async (req, res) => {
  try {
    const userData = await userModel.find({});
    if (userData) {
      res.status(200).json({ data: true, message: "Users", userData });
    } else {
      res.status(400).json({ data: false, message: "Data not found" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
};

const eventDetails = async (req, res) => {
  try {
    const eventData = await eventModel.find({}).populate("communityId");
    if (eventData) {
      res.status(200).json({ data: true, message: "Events", eventData });
    } else {
      res.status(400).json({ data: false, message: "Data not found" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
};

const communityDetails = async (req, res) => {
  try {
    const communityData = await communityModel.find({});
    if (communityData) {
      res
        .status(200)
        .json({ data: true, message: "Communities", communityData });
    } else {
      res.status(400).json({ data: false, message: "Data not found" });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: true, message: error.message });
  }
};

const reportDetails = async(req,res)=>{
  try {
    const reportData = await reportModel.find({}).populate("questionId")
    console.log(reportData);
    if(reportData){
      res
        .status(200)
        .json({ data: true, message: "Communities", reportData });
    }else {
      res.status(400).json({ data: false, message: "Data not found" });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: true, message: error.message });
  }
}

const userAction = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await userModel.findById(id);
    if (user) {
      await userModel.updateOne(
        { _id: id },
        { $set: { status: !user.status } }
      );
      res
        .status(200)
        .json({ message: user.status ? "User Blocked" : "User UnBlocked" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error updating user status:", error);
    res.status(500).json({ message: "Failed to update user status" });
  }
};

const eventAction = async (req, res) => {
  try {
    const id = req.params.id;
    const event = await eventModel.findById(id);

    if (event) {
      await eventModel.updateOne(
        { _id: id },
        { $set: { status: !event.status } }
      );
      res
        .status(200)
        .json({ message: event.status ? "Event Unlisted" : "Event Listed" });
    } else {
      res.status(404).json({ message: "Event not found" });
    }
  } catch (error) {
    console.error("Error updating user status:", error);
    res.status(500).json({ message: "Failed to update user status" });
  }
};

const communityAction = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const community = await communityModel.findById(id);

    if (community) {
      await communityModel.updateOne(
        { _id: id },
        { $set: { status: !community.status } }
      );
      res
        .status(200)
        .json({
          message: community.status ? "Community Unlisted" : "Community Listed",
        });
    } else {
      res.status(404).json({ message: "Community not found" });
    }
  } catch (error) {
    console.error("Error updating Community status:", error);
    res.status(500).json({ message: "Failed to update Community status" });
  }
};

const reportAction = async (req, res) => {
  try {
    const id = req.params.id;
    const report = await questionModel.findById(id)
    if (report) {
      await questionModel.updateOne(
        { _id: id },
        { $set: { status: !report.status } }
      );
      res
        .status(200)
        .json({
          message: report.status ? "Question Unlisted" : "Question Listed",
        });
    } else {
      res.status(404).json({ message: "Question not found" });
    }
  } catch (error) {
    console.error("Error updating Question status:", error);
    res.status(500).json({ message: "Failed to update Question status" });
  }
};



module.exports = {
  adminLogin,
  isAdminAuth,
  userDetails,
  eventDetails,
  communityDetails,
  reportDetails,
  userAction,
  eventAction,
  communityAction,
  reportAction
};
