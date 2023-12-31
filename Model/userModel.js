const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  image: {
    type: String,
  },
  github:{
    type:String
  },
  linkedin:{
    type:String
  },
  about:{
    type:String
  },
  joinedDate: {
    type: String,
    set: function() {
      const date = new Date();
      const options = { day: "numeric", month: "long", year: "numeric" };
      return date.toLocaleDateString("en-US", options);
    },
  },
  saved:[{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"questions",
    },
  }],
  asked:[{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"questions",
    },
  }],
  status:{
    type:Boolean,
    default:true
  },
});

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
