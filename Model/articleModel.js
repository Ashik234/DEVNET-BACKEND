const mongoose = require("mongoose")

const articleSchema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    description: {
        type: String,
        required: true,
    },
    status:{
        type:Boolean,
        default:true
    },
    likes: {
        count: {
            type: Number,
            default: 0 
        },
        users: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }]
    }
})

const articleModel = mongoose.model("article", articleSchema);

module.exports = articleModel;
