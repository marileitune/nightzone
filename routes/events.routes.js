const express = require('express')
const router = express.Router()

//other packages installed


//models required
const User = require('../models/User.model')
const Event = require('../models/Event.model')
const Comment = require('../models/Comment.model')

//START ROUTES

//handle create event
router.post('/create', async (req, res) => {
    try {
        const {name, startDate, startTime, endDate, endTime, address, country, city, isPaid, ticketsPrice, capacity, description, categories, imageEvent} = req.body
        const user = req.session.loggedInUser._id
        const event = await Event.create({name, startDate, startTime, endDate, endTime, address, country, city, isPaid, ticketsPrice, capacity, description, categories, imageEvent, host: user})
        return res.status(200).json(event)
    }
    catch(err) {
            return res.status(500).json({
                error: 'Something went wrong',
                message: err
            })
    } 
})

//handle events list
router.get('/events', async (req, res) => {
    try { 
        const events = await Event.find()
        .populate('checkIn')
        return res.status(200).json(events)
    }
    catch(err) {
        return   res.status(500).json({
                error: 'Something went wrong',
                message: err
            })
    }
})

//handle event detail
router.get('/events/:eventId', async (req, res) => {
    try {
        const event = await Event.findById(req.params.eventId)
        .populate('host')
        .populate('comments')
        return res.status(200).json(event)
    }
    catch(err){
        res.status(500).json({
            error: 'Something went wrong',
            message: err
        })
    }
})

//handle edit event 
router.patch('/events/:eventId', async (req, res) => {
    try {
        let eventId = req.params.eventId
        const {name, startDate, startTime, endDate, endTime, address, country, city, isPaid, ticketsPrice, capacity, description, imageEvent} = req.body
        let response = await Event.findByIdAndUpdate({_id: eventId}, {name, startDate, startTime, endDate, endTime, address, country, city, isPaid, ticketsPrice, capacity, description, imageEvent}, {new: true})
        return res.status(200).json(response)
    }
    catch(err){
        return res.status(500).json({
            error: 'Something went wrong',
            message: err
        })
    }
})

//handle delete event
router.delete('/events/:eventId', async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.eventId)
        return res.status(200).json()
    }
    catch(err) {
        return res.status(500).json({
            error: 'Something went wrong',
            message: err
        })
    }
})

//handle post comment
router.post('/events/:eventId/comment', async (req, res) => {
    try {
        const event = req.params.eventId
        const user = req.session.loggedInUser._id
        const {comment} = req.body
        const myComment = await Comment.create({comment, authorId: user, eventId: event})
        await Event.findByIdAndUpdate({_id: event}, { $push: { comments: myComment._id}})
        return res.status(200).json()
    }
    catch(err) {
        return res.status(500).json({
            error: 'Something went wrong',
            message: err
        })
    }
})

router.post('/events/:eventId/checkin', async (req, res) => {
    try {
        const event = req.params.eventId
        const user = req.session.loggedInUser._id
        await Event.findByIdAndUpdate({_id: event}, { $push: { checkIn: user}})
        return res.status(200).json()
    }
    catch(err) {
        return res.status(500).json({
            error: 'Something went wrong',
            message: err
        })
    }
})

module.exports = router;