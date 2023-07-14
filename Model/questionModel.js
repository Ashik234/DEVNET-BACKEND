const mongoose = require("mongoose")

const questionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    title:{
        type: String,
        required: true
    },
    description:{
        type:String,
        required:true
    },
    tags:{
        type:Array,
        required:true
    },
    answers: {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "users",
        },
        date: {
          type: Date,
          default: Date.now,
        },
        answer: {
          type: String,
        },
        verified: {
          type: Boolean,
          default: false,
        },
      },
})

const questionModel = mongoose.model("questions",questionSchema)

module.exports = questionModel