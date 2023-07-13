const questionModel = require("../Model/questionModel");

const askQuestion = async (req, res) => {
    try {
        const {user,title,description,tags} = req.body
        const newQuestion = new questionModel({
            userId:user,
            title,
            description,
            tags,
        })
        let question = await newQuestion.save().then(console.log("Question Created"))
        .catch((err)=>console.log(err))
        if(question){
            res.status(200).json({success:true,message:"Created Successfully"})
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: true, message: error.message });
    }
};

const getQuestions = async(req,res)=>{
    try {
        let questionData = await questionModel.find({}).populate("userId")
        if(questionData){
            res.status(200).json({data:true,message:"Questions",questionData})
        }else{
            res.status(200).json({data:false, message: "No Data Found",})    
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: true, message: error.message });
    }
}


module.exports = {
    askQuestion,
    getQuestions
}