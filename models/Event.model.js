const { Schema, model } = require("mongoose");

const eventSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    startDate: {
        type: String,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endDate: {
        type: String,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    isPaid: {
        type: Boolean,
        required: true
      },
    ticketsPrice: Number,
    capacity: {
        type: Number,
        required: true
    },
    categories: [String],
    description: {
        type: String,
        required: true
    },
    imageAccount: {
         type: String,
         required: true
    },
    ticketsSold:[{
       type: Schema.Types.ObjectId,
       ref: 'user'
    }],
    host : {
       type: Schema.Types.ObjectId,
        ref: "user",
    }
});

const Event = model("Event", eventSchema);

module.exports = Event;
