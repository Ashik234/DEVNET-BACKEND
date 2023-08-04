const mongoose = require("mongoose")

const reportSchema = new mongoose.Schema({
    reason:{
        type:String,
        required:true
    },
    questionId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "questions",
    }
})

const reportModel = mongoose.model("report",reportSchema)

module.exports = reportModel