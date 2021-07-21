const { Schema, model } = require("mongoose");

const commentSchema = new Schema({
    comment: {
        type: String,
        required: true
    },
    authorId : {
        type: Schema.Types.ObjectId,
        ref: "user",
    },
    eventId : {
        type: Schema.Types.ObjectId,
        ref: "event",
    }
});

const Comment = model("Comment", commentSchema);

module.exports = Comment;
