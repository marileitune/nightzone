const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true
  },
  password: String,
  googleID: String,
  facebookId: String,
  imageAccount: {
    type: String,
    default: 'https://res.cloudinary.com/dplgnsjzm/image/upload/v1626877273/nightpark-backend/images/default-avatar_bq7scv.png'
  },
  eventsCreated:[{
    type: Schema.Types.ObjectId,
    ref: 'Event'
  }],
  ticketsBought: [{
    type: Schema.Types.ObjectId,
    ref: 'Event'
  }],
  superHost: {
    type: Number,
    default: false
  }
});

const User = model("User", userSchema);

module.exports = User;
