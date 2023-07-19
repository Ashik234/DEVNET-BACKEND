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
    community:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "communities",
    },
    registeredby:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    }]
})

const eventModel = mongoose.model("event",eventSchema)

module.exports = eventModel