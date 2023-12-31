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
    } else {
      res
        .status(400)
        .json({ success: false, message: "Error Creating Community" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: true, message: error.message });
  }
};

const editCommunity = async (req, res) => {
  try {
    const id = req.params.id;
    const { title, description } = req.body;

    const updatedCommunity = await communityModel.findOneAndUpdate(
      { _id: id },
      { title, description },
      { new: true }
    );

    if (!updatedCommunity) {
      return res
        .status(404)
        .json({ error: true, message: "Community not found." });
    }
    return res
      .status(200)
      .json({ message: "Community updated successfully", updatedCommunity });
  } catch (error) {
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
    } else {
      return res.status(400).json({
        success: false,
        message: "Error Joining The Community",
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
    const communityData = await communityModel.find({
      $text: { $search: query },
    });
    if (communityData) {
      return res.status(200).json({ communityData });
    } else {
      return res.status(400).json({ message: "No Search Results Found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createCommunity,
  editCommunity,
  getCommunity,
  getSingleCommunity,
  joinCommunity,
  searchCommunity,
};
