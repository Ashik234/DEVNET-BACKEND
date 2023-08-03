const chatModel = require("../Model/chatModel");

const createChat = async (req, res) => {
  try {
    const exists = await chatModel.findOne({
      members: { $all: [req.body.senderId, req.body.receiverId] },
    });
    if (exists) {
      console.log(exists, "haiiii");
      return res
        .status(200)
        .json({ message: "chat already exists", chatData: exists });
    }
    const newChat = new chatModel({
      members: [req.body.senderId, req.body.receiverId],
    });
    const result = await newChat.save();
    res.status(200).json({ chatData: result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: true, message: error.message });
  }
};

const userChat = async (req, res) => {
  try {
    const chat = await chatModel.find({
      members: { $in: [req.params.userId] },
    }).sort({ createdAt: -1 });
    console.log(chat,"dddddd");
    res.status(200).json({ chat });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: true, message: error.message });
  }
};

const findChat = async (req, res) => {
  try {
    console.log(req.params.firstId, "fffffff");
    console.log(req.params.secondId, "sssssssssss");
    const chat = await chatModel.find({
      members: { $all: [req.params.firstId, req.params.secondId] },
    });
    res.status(200).json({ chat });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: true, message: error.message });
  }
};

module.exports = {
  createChat,
  userChat,
  findChat,
};
