const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tags: {
    type: Array,
    required: true,
  },
  createdAt: {
    type: String,
    set: function () {
      const date = new Date();
      const options = { day: "numeric", month: "long", year: "numeric" };
      return date.toLocaleDateString("en-US", options);
    },
  },
  answers: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
      submitedAt: {
        type: String,
        set: function () {
          const date = new Date();
          const options = { day: "numeric", month: "long", year: "numeric" };
          return date.toLocaleDateString("en-US", options);
        },
      },
      answer: {
        type: String,
      },
      verified: {
        type: Boolean,
        default: false,
      },
    },
  ],       
});

const questionModel = mongoose.model("questions", questionSchema);

module.exports = questionModel;
