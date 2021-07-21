const express = require('express')
const router = express.Router()


//START ROUTES

//handle events list
router.get('/events', (req, res) => {

})

//handle event detail
router.get('/events/:eventId', (req, res) => {

})

//handle edit event 
router.patch('/events/:eventId', (req, res) => {

})

//handle delete event
router.delete('/events/:eventId', (req, res) => {

})

//handle post comment
router.post('/events/:eventId/comment', (req, res) => {

})

//handle create event
router.post('/create', (req, res) => {

})

module.exports = router;