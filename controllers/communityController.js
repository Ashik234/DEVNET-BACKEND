const communityModel = require("../Model/communityModel");
const { uploadToCloudinary } = require("../Config/Cloudinary");

const createCommunity = async (req, res) => {
  try {
    const { title, image, description, type, createdAt } = req.body;
    const data = await uploadToCloudinary(image, "communities");
    console.log(data, "dataaaaaaaaaaaaaa");
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
    });
    const community = await newCommunity.save();
    if (community) {
      res
        .status(200)
        .json({ success: true, message: "Community Created Successfully" });
    }
  } catch (error) {
    console.log(error);
  }
};

const getCommunity = async (req, res) => {
  try {
    let communityData = await communityModel.find({});
    if (communityData) {
      res
        .status(200)
        .json({ data: true, message: "Communities", communityData });
    } else {
      res.status(200).json({ data: false, message: "No Data Found" });
    }
  } catch (error) {
    console.log(error);
  }
};

const getSingleCommunity = async (req, res) => {
  try {
    const id = req.params.id;
    let singlecommunity = await communityModel.findOne({ _id: id }).populate("members.member")
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
      return res
        .status(200)
        .json({
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

module.exports = {
  createCommunity,
  getCommunity,
  getSingleCommunity,
  joinCommunity,
};
