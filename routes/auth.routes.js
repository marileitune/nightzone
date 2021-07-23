
const express = require('express')
const router = express.Router()

//other packages installed
const bcrypt = require('bcryptjs'); //encrypts password

//models required
const User = require('../models/User.model')

//START ROUTES  

router.post('/auth', async (req, res) => {

  // I don't think make sense do it here, because the verification is already being done in the signup or signin
  // if (!email) {
  //   res.status(500).json({
  //     errorMessage: 'Please fill in the field'
  // });
  // }

  // //validation: check if email is in the right format
  // const reEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  // if (!reEmail.test(email)) {
  //   res.status(500).json({
  //     errorMessage: 'Please enter a valid email address'
  //   });
  //     return;
  // }
  
  //search the email in the DB
  try {
    const { email } = req.body //grab the email typed by the user
    console.log(req.body)
    const user = await User.findOne({ email })
    console.log(user)
    if (user) {
      return res.status(200).json(user);
      //if the email already exists in the DB, continue with signin
  
      //continue with signup
    } else { //if the email doesn't exist in the DB, continue with signup
      //continue with signin
      return res.status(200).json(null);
    }
  }
  catch (err) {
    return res.status(500).json({
      error: 'Something went wrong',
      message: err
    })
  }
})

router.post('/signup', async (req, res) => {
  try{
    const { firstName, lastName, email, password, confirmPassword } = req.body
    console.log(req.body)
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
    
    //encryption: create a salt and a hash
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password, salt);
    const user = await User.create({firstName, lastName, email, password: hash})
    user.password = "***";
    req.session.loggedInUser = user;
     res.status(200).json(user); 
  }
  catch(err){
      return res.status(500).json({
        errorMessage: 'Something went wrong. Please try again',
        message: err,
      });
  }
})

router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body
    console.log(req.body)
    if (!email || !password) {
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

    const user = await User.findOne({email})
    if (user) {
      //check if the password that the user typed is the same that already exists in DB
      const passwordMatch = await bcrypt.compare(password, user.password)
      console.log(passwordMatch)
      if (passwordMatch) {
        user.password = "***";
        req.session.loggedInUser = user;
        return res.status(200).json(user)
      }
      //if both passwords don't match
      else {
        return res.status(500).json({
          errorMessage: "Your password is wrong"
        })
      }
    } 
    else { //if the email doesn't exist in the DB, return an error
      return res.status(500).json({
        errorMessage: 'Email does not exist'
      })
    }
  }
  catch(err){
    return res.status(500).json({
      error: 'Something went wrong. Please try again',
      message: err
    })
  }
})

router.post('/logout', (req, res) => {
  req.session.destroy();
  // Nothing to send back to the user
  return res.status(204).json({});   
})

//middleware to check if the user is loggedIn
const isLoggedIn = (req, res, next) => {  
    if (req.session.loggedInUser) {
        //calls whatever is to be executed after the isLoggedIn function is over
        next()
    }
    else {
        res.status(401).json({
            message: 'Unauthorized user',
            code: 401,
        })
    };
  };
  
  
  // THIS IS A PROTECTED ROUTE
  // will handle all get requests to http:localhost:5005/api/user
  router.get("/user", isLoggedIn, (req, res, next) => {
    res.status(200).json(req.session.loggedInUser);
  });

module.exports = router;