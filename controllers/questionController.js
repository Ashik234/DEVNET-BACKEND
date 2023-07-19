const questionModel = require("../Model/questionModel");
const userModel = require("../Model/userModel")

const askQuestion = async (req, res) => {
  try {
    const { user, title, description, tags, createdAt } = req.body;
    const newQuestion = new questionModel({
      userId: user,
      title,
      description,
      tags,
      createdAt,
    });
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

const saveQuestion = async(req,res)=>{
  try {
    const id = req.params.id;
    const userId = req.userId;

    updatedProfile = await userModel.updateOne(
      {_id:userId},
      {$push:{saved:{questionId:id}}}
    )
    if(updatedProfile){
      return res
      .status(200)
      .json({ success: true, message: "Question Saved Successfully" });
    }   
  } catch (error) {
    console.log(error);
  }
}

const getSavedQuestions = async(req,res)=>{
  try {
    const userId = req.userId;
    console.log(userId);

    const savedQuestions = await userModel.findOne({_id:userId}).populate("saved.questionId")
    console.log(savedQuestions);
if(savedQuestions){
  res
        .status(200)
        .json({ data: true, message: "SavedQuestions ", savedQuestions });
    } else {
      res.status(200).json({ data: false, message: "No Data Found" });
    }
  } catch (error) {
    console.log(error);
  }

}

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
      return res
        .status(400)
        .json({
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

module.exports = {
  askQuestion,
  saveQuestion,
  getQuestions,
  getSavedQuestions,
  getSingleQuestion,
  answerQuestion,
};
