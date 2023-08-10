const questionModel = require("../Model/questionModel");
const reportModel = require("../Model/reportModel");
const userModel = require("../Model/userModel");
const articleModel = require("../Model/articleModel");

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
    }else{
      res
      .status(400)
      .json({ success: false, message: "Error Creating Question" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: true, message: error.message });
  }
};

const getQuestions = async (req, res) => {
  try {
    let questionData = await questionModel.find({status:true}).populate("userId");
    
    if (questionData) {
    questionData = questionData.map((question) => ({
      ...question._doc, 
      numAnswers: question.answers.length, 
    }));
      res.status(200).json({ data: true, message: "Questions", questionData });
    } else {
      res.status(400).json({ data: false, message: "No Data Found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: true, message: error.message });
  }
};

const editQuestions = async (req, res) => {
  try {
    const id = req.params.id;
    const { title, description, tags } = req.body;

    const updatedQuestion = await questionModel.findOneAndUpdate(
      { _id: id }, 
      { title, description, tags }, 
      { new: true }
    );

    if (!updatedQuestion) {
      return res.status(404).json({ error: true, message: "Question not found." });
    }
    return res.status(200).json({message:"Question updated successfully",updatedQuestion});
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
};

const questionReport = async(req,res)=>{
  try {
      const id = req.params.id
      const userId = req.userId;
      console.log(userId);
      const {reason}= req.body
      const report = new reportModel({
        reason ,
        questionId :id,
        userId
      })
      let newReport = report.save()
      if(newReport){
        res
        .status(200)
        .json({ success: true, message: "Question Reported Successfully" });
      }else{
        res
        .status(400)
        .json({ success: false, message: "Error Reporting Question" });
      }
  } catch (error) {
      console.log(error);
      return res.status(500).json({ error: true, message: error.message });
  }
}


const saveQuestion = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.userId;

    const user = await userModel.findOne({ _id: userId, "saved.questionId": id });
    if (user) {
      return res.status(200).json({
        data: false,
        success: false,
        message: "Question Already Saved",
      });
    }
    const updatedProfile = await userModel.findOneAndUpdate(
      { _id: userId },
      { $push: { saved: { questionId: id } } },
      { new: true }
    );
    if (updatedProfile) {
      return res.status(200).json({
        data: true,
        success: true,
        message: "Question Saved Successfully",
        updatedProfile,
      });
    }else{
      return res.status(400).json({
        data: false,
        success: false,
        message: "Error Saving Question",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: true, message: error.message });
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
      res.status(400).json({ data: false, message: "No Data Found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: true, message: error.message });
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
      res.status(400).json({ data: false, message: "No Data Found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: true, message: error.message });
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
      res.status(400).json({ data: false, message: "No Data Found" });
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
      "answers.userId": userId,
    });

    if (existingQuestion) {
      return res.status(200).json({
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
    }else{
      return res
        .status(400)
        .json({ success: false, message: "Error Submiting Answer" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const editAnswer = async(req,res)=>{
  try {
    const id = req.params.id;
    const {answer} = req.body
    const updatedAnswer = await questionModel.findOneAndUpdate(
      { "answers._id": id },
      { "$set": { "answers.$.answer": answer } },
      { new: true }
    );
    if (!updatedAnswer) {
      return res.status(404).json({ error: true, message: "Answer not found." });
    }
    return res.status(200).json({message:"Answer updated successfully",updatedAnswer});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

const verifiedAnswer = async (req, res) => {
  try {
    const id = req.params.id
    const updatedAnswer = await questionModel.findOneAndUpdate(
      { "answers._id": id },
      { "$set": { "answers.$.verified": true } },
      { new: true }
    );
    if (!updatedAnswer) {
      return res.status(404).json({ error: true, message: "Answer not found." });
    }
    return res.status(200).json({message:"Answer verified successfully",updatedAnswer});

  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const searchQuestions = async (req, res) => {
  try {
    const { query } = req.query;
    const questionData = await questionModel
      .find({ $text: { $search: query } })
      .populate("userId");
      if(questionData){
        return res.status(200).json({ questionData });
      }else{
        return res.status(400).json({ message:"No Search Results Found" });
      }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getArticles = async(req,res)=>{
  try {
    const articleData = await articleModel.find({});
    if (articleData) {
      res.status(200).json({ data: true, message: "Articles", articleData });
    } else {
      res.status(400).json({ data: false, message: "Data not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
    
  }
}

const getSingleArticle = async(req,res)=>{
  try {
    const id = req.params.id;
    let singleArticle= await articleModel
      .findOne({ _id: id })
    if (singleArticle) {
      res
        .status(200)
        .json({ data: true, message: "Single Question", singleArticle });
    } else {
      res.status(200).json({ data: false, message: "No Data Found" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  
  }
}

module.exports = {
  askQuestion,
  saveQuestion,
  getQuestions,
  editQuestions,
  questionReport,
  getSavedQuestions,
  getAskedQuestions,
  getSingleQuestion,
  answerQuestion,
  editAnswer,
  verifiedAnswer,
  searchQuestions,
  getArticles,
  getSingleArticle
};