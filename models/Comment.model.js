const { Schema, model } = require("mongoose");

const commentSchema = new Schema({
    comment: {
        type: String,
        required: true
    },
    authorId : {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    eventId : {
        type: Schema.Types.ObjectId,
        ref: "Event",
    }
});

const Comment = model("Comment", commentSchema);

module.exports = Comment;
