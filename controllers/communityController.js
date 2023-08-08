const communityModel = require("../Model/communityModel");
const { uploadToCloudinary } = require("../Config/Cloudinary");

const createCommunity = async (req, res) => {
  try {
    const url = req.file.path;
    const { title, description, type, createdAt, status } = req.body;
    const data = await uploadToCloudinary(url, "communities");
    const image = data.url;
    const userId = req.userId;
    const newCommunity = new communityModel({
      title,
      image,
      description,
      type,
      createdAt,
      members: [
        {
          member: userId,
          role: "Admin",
        },
      ],
      status,
    });
    const community = await newCommunity.save();
    if (community) {
      res
        .status(200)
        .json({ success: true, message: "Community Created Successfully" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: true, message: error.message });
  }
};

const getCommunity = async (req, res) => {
  try {
    let communityData = await communityModel.find({ status: true });
    if (communityData) {
      res
        .status(200)
        .json({ data: true, message: "Communities", communityData });
    } else {
      res
        .status(200)
        .json({ data: false, message: "No Active Communities Found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ data: false, message: "Internal Server Error" });
  }
};

const getSingleCommunity = async (req, res) => {
  try {
    const id = req.params.id;
    let singlecommunity = await communityModel
      .findOne({ _id: id })
      .populate("members.member");
    if (singlecommunity) {
      const numberOfMembers = singlecommunity.members.length;
      singlecommunity = {
        ...singlecommunity.toObject(),
        numberOfMembers: numberOfMembers,
      };
      res
        .status(200)
        .json({ data: true, message: "Single Community", singlecommunity });
    } else {
      res.status(200).json({ data: false, message: "No Data Found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: true, message: error.message });
  }
};

const joinCommunity = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.userId;
    const updatedCommunity = await communityModel.updateOne(
      { _id: id },
      { $push: { members: { member: userId, role: "Member" } } }
    );
    if (updatedCommunity) {
      return res.status(200).json({
        success: true,
        message: "Joined The Community Successfully",
        updatedCommunity,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const searchCommunity = async (req, res) => {
  try {
    const { query } = req.query;
    console.log(query);
    const communityData = await communityModel.find({
      $text: { $search: query },
    });
    console.log(communityData);
    return res.status(200).json({ communityData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createCommunity,
  getCommunity,
  getSingleCommunity,
  joinCommunity,
  searchCommunity,
};
