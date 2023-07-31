const questionModel = require("../Model/questionModel");
const userModel = require("../Model/userModel");

const askQuestion = async (req, res) => {
  try {
    const { title, description, tags, createdAt } = req.body;
    const userId = req.userId;
    const user = await userModel.findById(userId);
    const newQuestion = new questionModel({
      userId: userId,
      title,
      description,
      tags,
      createdAt,
    });
    user.asked.push({ questionId: newQuestion._id });
    await user.save();
    let question = await newQuestion.save().catch((err) => console.log(err));
    if (question) {
      res
        .status(200)
        .json({ success: true, message: "Question Created Successfully" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: true, message: error.message });
  }
};


const getQuestions = async (req, res) => {
  try {
    let questionData = await questionModel.find({}).populate("userId");
    if (questionData) {
      res.status(200).json({ data: true, message: "Questions", questionData });
    } else {
      res.status(200).json({ data: false, message: "No Data Found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: true, message: error.message });
  }
};

const saveQuestion = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.userId;
console.log(id,"idddd");
const updatedProfile = await userModel.findOneAndUpdate(
  { _id: userId },
  { $push: { saved: { questionId: id } } },
  { new: true }
);
    if (updatedProfile) {
      return res
        .status(200)
        .json({data:true, success: true, message: "Question Saved Successfully" ,updatedProfile});
    }
  } catch (error) {
    console.log(error);
  }
};

const getSavedQuestions = async (req, res) => {
  try {
    const userId = req.userId;

    const savedQuestions = await userModel
      .findOne({ _id: userId })
      .populate("saved.questionId");
    if (savedQuestions) {
      res
        .status(200)
        .json({ data: true, message: "SavedQuestions ", savedQuestions });
    } else {
      res.status(200).json({ data: false, message: "No Data Found" });
    }
  } catch (error) {
    console.log(error);
  }
};

const getAskedQuestions = async (req, res) => {
  try {
    const userId = req.userId;
    const askedQuestions = await userModel
      .findOne({ _id: userId })
      .populate("asked.questionId");
    if (askedQuestions) {
      res
        .status(200)
        .json({ data: true, message: "AskedQuestions ", askedQuestions });
    } else {
      res.status(200).json({ data: false, message: "No Data Found" });
    }
  } catch (error) {
    console.log(error);
  }
};

const getSingleQuestion = async (req, res) => {
  try {
    const id = req.params.id;
    let singlequestion = await questionModel
      .findOne({ _id: id })
      .populate("userId")
      .populate("answers.userId");
    if (singlequestion) {
      res
        .status(200)
        .json({ data: true, message: "Single Question", singlequestion });
    } else {
      res.status(200).json({ data: false, message: "No Data Found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: true, message: error.message });
  }
};

const answerQuestion = async (req, res) => {
  try {
    const id = req.params.id;
    const { answer } = req.body;
    const userId = req.userId;
    const existingQuestion = await questionModel.findOne({
      _id: id,
      "answers.answer": answer,
    });

    if (existingQuestion) {
      return res.status(400).json({
        success: false,
        message: "You've already answered this question",
      });
    }

    const updatedQuestion = await questionModel.updateOne(
      { _id: id },
      { $push: { answers: { answer: answer, userId: userId } } }
    );
    if (updatedQuestion) {
      return res
        .status(200)
        .json({ success: true, message: "Answer Submitted Successfully" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const verifiedAnswer = async(req,res)=>{
  try {
    console.log("verifiedAnswer");
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}


const searchQuestions = async (req, res) => {
  try {
    console.log("searchQuestions");
    const { query } = req.query; 
    console.log(query,"gggggggggggggggggggggggggggggg");
    const questionData = await questionModel
      .find({ $text: { $search: query } }) 
      .populate("userId");
      console.log(questionData);
    return res.status(200).json({ questionData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


module.exports = {
  askQuestion,
  saveQuestion,
  getQuestions,
  getSavedQuestions,
  getAskedQuestions,
  getSingleQuestion,
  answerQuestion,
  verifiedAnswer,
  searchQuestions
};
