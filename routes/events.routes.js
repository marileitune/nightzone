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
        console.log(req.body)
        const {name, start, end, address, country, city, isPaid, ticketsPrice, capacity, description, categories, imageEvent} = req.body
        const user = req.session.loggedInUser._id
        const event = await Event.create({name, start, end, address, country, city, isPaid, ticketsPrice, capacity, description, categories, imageEvent, host: user})
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
        console.log('events userId:', req.session.loggedInUser)
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
        let event = await Event.findById(req.params.eventId)
        .populate('host')
        user = req.session.loggedInUser._id
        console.log(user, event.ticketsSold)

        const comments = await Comment.find({eventId: req.params.eventId})
        .populate('authorId')
        event.comments = comments//these are the  event comments populated with user data
        console.log('event.host._id = ', event.host._id, 'user = ', user)
        if (event.ticketsSold.includes(user) || event.host._id == user) {
            event = {
                event: event,
                canBuy: false, 
            }
        } else {
            event = {
                event: event,
                canBuy: true
            }
        }
        return res.status(200).json(event)

    }
    catch(err){
        res.status(500).json({
            error: 'Something went wrong',
            message: err
        })
    }
})

//handle buy ticket 
//why does post method reset the req.session.loggedInUser? Because of it I needed to to a get here.
router.get('/events/:eventId/buy', async (req, res) => {
    try {
        //if the payment is successful, we need to update the DB (user: ticketsBought ; event: ticketsSold)
        const event = await Event.findByIdAndUpdate({_id: req.params.eventId}, { $push: { ticketsSold: req.session.loggedInUser._id } })
        const user = await User.findByIdAndUpdate({_id: req.session.loggedInUser._id}, { $push: { ticketsBought: req.params.eventId } })
        return res.status(200).json(event)
    }
    catch (err) {
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
        const {name, start, end, address, country, city, isPaid, ticketsPrice, capacity, description, imageEvent} = req.body
        let response = await Event.findByIdAndUpdate({_id: eventId}, {name, start, end, address, country, city, isPaid, ticketsPrice, capacity, description, imageEvent}, {new: true})
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

//handle check in
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

//handle checkIn
router.get('/events/:eventId/checkIn', async (req, res) => {
    try {
        let event = await Event.findByIdAndUpdate({_id: req.params.eventId}, { $push: { checkIn: req.session.loggedInUser._id } })
        return res.status(200).json(event)
    }
    catch(err) {
       return res.status(500).json({
           error: 'Something went wrong',
           message: err
       })
    }
   })

module.exports = router;