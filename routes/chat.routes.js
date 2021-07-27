const router = require("express").Router();
const Conversation = require('../models/Conversation.model')
const Message = require('../models/Message.model')

// A route to return the converstaion id between two participants if it already exists
// or create a new converstaion, when users chat for the first time
router.post('/conversation', (req, res, next) => {
    //The user will send an array of participant ids in the chat (usually just two)
    // eg. participants = ['609b63324f3c1632c8ff35f4', '609b63644f3c1632c8ff35f5']
    const {participants} = req.body
    console.log("participants", participants)
    Conversation.findOne({ participants: { $all: participants} })
      .then((found) => {
        if (found) {
          //Conversation between those participants already present
          res.status(200).json(found)
        }
        else {
            console.log("not found", found)

          //Create a conversation between them if not present
          Conversation.create({participants})
            .then((response) => {
              res.status(200).json(response)
            })
        }
      })
      .catch((err) => {
          next(err)       
      })
})

// A route to get all messages of a certain converstaion 
router.get('/messages/:conversationId', async(req, res, next) => {
    try {
        const {conversationId} = req.params
        let messages = await Message.find({conversationId})
        .populate('sender')
        console.log(messages)
        res.status(200).json(messages)
    }
    catch(err) {
        console.log(err)
        return res.status(500).json({
            error: 'Something went wrong',
            message: err
        })
     }
})

module.exports = router;