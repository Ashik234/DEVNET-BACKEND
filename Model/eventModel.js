const mongoose = require("mongoose")

const eventSchema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    date: {
        type: String,
        set: function () {
          const date = new Date();
          const options = { day: "numeric", month: "long", year: "numeric" };
          return date.toLocaleDateString("en-US", options);
        },
    },
    location:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    communityId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "community",
    },
    registeredby:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    }],
    status:{
        type:Boolean,
        default:true
    },
})

const eventModel = mongoose.model("event",eventSchema)

module.exports = eventModel