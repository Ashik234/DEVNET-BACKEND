const mongoose = require("mongoose");

const discussionSchema = mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    community: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "community"
    },
    publicId: {
        type: String
    },
})

module.exports = mongoose.model("discussion",discussionSchema)