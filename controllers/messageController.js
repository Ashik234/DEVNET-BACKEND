const messageModel = require("../Model/messageModel");

const addMessage = async (req, res) => {
  try {
    const { chatId, senderId, text } = req.body;
    const message = new messageModel({
      chatId,
      senderId,
      text,
    });
    const result = await message.save();
    if (result) {
      return res.status(200).json({ result });
    }else{
      return res.status(400).json({ message:"No Results Found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const result = await messageModel.find({ chatId });
    if (result) {
      return res.status(200).json({ result });
    }else{
      return res.status(400).json({ message:"No Results Found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

module.exports = {
  addMessage,
  getMessages,
};
