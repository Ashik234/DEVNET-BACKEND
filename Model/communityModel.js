const mongoose = require("mongoose");

const communitySchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    // required:true
  },
  type: {
    type: String,
    required: true,
  },
  description: {
    type: String,
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
  members: [
    {
      member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
      role: {
        type: String,
      },
    },
  ],
});

const communityModel = mongoose.model("community", communitySchema);

module.exports = communityModel;
