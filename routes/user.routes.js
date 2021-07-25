const express = require('express')
const router = express.Router()

//other packages installed
const bcrypt = require('bcryptjs'); //encrypts password

//models required
const User = require('../models/User.model')

//START ROUTES

//handle show account
router.get('/account/:userId', async (req, res) => {
 try {
    let user = await User.findById(req.params.userId)
    .populate('ticketsBought')
    .populate('eventsCreated')
    let ticketsBought = user.ticketsBought.map((event) => {
        let today = new Date().getTime(); 
        let eventStartDate = Date.parse(event.start); 
        let eventEndDate = Date.parse(event.end);//comparing all the dates in milliseconds 

        if (!event.checkIn.includes(user._id) && today > eventStartDate && today < eventEndDate) {
           return  event = {
                event: event,
                canCheckIn: true, 
            }
        } else {
            return event = {
                event: event,
                canCheckIn: false, 
            }
        } 
    })
    
    ticketsBought.map((event, i) => {
        user.ticketsBought[i] = event
    })

    return res.status(200).json(user)
 }
 catch(err) {
    return res.status(500).json({
        error: 'Something went wrong',
        message: err
    })
 }
})


//handle edit account
router.patch('/account/:userId', async (req, res) => {
    try {
        let userId = req.params.userId
        const {firstName, lastName, email, imageAccount, password, confirmPassword} = req.body
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            return res.status(500).json({
                errorMessage: 'Please fill in all fields'
            });
          }
        //validation: check if email is in the right format
        const reEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!reEmail.test(email)) {
            return res.status(500).json({
                errorMessage: 'Please enter a valid email address'
            });
        }
        //validation: check if the email already exist (and if it is loggedIn user's email)
        if (email !== req.session.loggedInUser.email) {
            let userExist = await User.findOne({email})
            if(userExist) {
                return res.status(500).json({
                    errorMessage: 'This email address already exist'
                });
            }
        }

        //validation: check if the password contains a special character, a number, and be 6-16 characters
        const rePassword = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
        if ( !rePassword.test(password) ) {
            return res.status(500).json({
                errorMessage: 'Password needs to have a special character, a number, and be 6-16 characters'
            });
        }
        //validation: check if both passwords match
        if ( password !== confirmPassword ) {
            return res.status(500).json({
                errorMessage: "The two passwords don't match"
            });
        }
          
        if (!imageAccount) {
            imageAccount = req.session.loggedInUser.imageAccount
        }
          //encryption: create a salt and a hash
        
          let salt = bcrypt.genSaltSync(10);
          let hash = bcrypt.hashSync(password, salt);
          const user = await User.findByIdAndUpdate({_id: userId}, {firstName, lastName, email, imageAccount, password: hash}, {new: true})
          user.password = "***";
          req.session.loggedInUser = user;
          return res.status(200).json(user); 
    }
    catch(err) {
       return res.status(500).json({
           error: 'Something went wrong',
           message: err
       })
    }
})

// handle delete account
router.delete('/account/:userId', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.userId)
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