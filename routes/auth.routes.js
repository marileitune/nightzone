
const express = require('express')
const router = express.Router()

//other packages installed
const bcrypt = require('bcryptjs'); //encrypts password

//models required
const User = require('../models/User.model')

//START ROUTES  

router.get('/auth', (req, res) => {
  console.log(req.body)
  const { email } = req.body //grab the email typed by the user

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
  User.findOne({ email })
    .then(user => {
      if (!user) {
        res.status(200).json(user);
        //if the email doesn't exist in the DB, continue with signup
        //continue with signup
      } else { //if the email already exists in the DB, continue with signin
        //continue with signin
        res.status(200).json(null);
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: 'Something went wrong',
        message: err
    })
  })
})

router.post('/signup', (req, res) => {
  const { firstName, lastName, email, age, password, confirmPassword } = req.body
  console.log(req.body)
  if (!firstName || !lastName || !email || !age || !password || !confirmPassword) {
    res.status(500).json({
      errorMessage: 'Please fill in all fields'
  });
    return; 
  }
  //validation: check if email is in the right format
  const reEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!reEmail.test(email)) {
    res.status(500).json({
      errorMessage: 'Please enter a valid email address'
    });
    return;
  }
  //validation: check if the password contains a special character, a number, and be 6-16 characters
  const rePassword = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
  if ( !rePassword.test(password) ) {
    res.status(500).json({
      errorMessage: 'Password needs to have a special character, a number, and be 6-16 characters'
    });
    return;
  }

  //validation: check if both passwords match
  if ( password !== confirmPassword ) {
    res.status(500).json({
      errorMessage: "The two passwords don't match"
    });
    return;
  }
  
  //encryption: create a salt and a hash
  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(password, salt);
  User.create({firstName, lastName, email, password: hash})
    .then(user => {
      user.password = "***";
      req.session.loggedInUser = user;
      res.status(200).json(user);
    })
    .catch((err) => {
      res.status(500).json({
        errorMessage: 'Something went wrong. Please try again',
        message: err,
      });
    })
})

router.post('/signin', (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    res.status(500).json({
      errorMessage: 'Please fill in all fields'
    });
  }

  //validation: check if email is in the right format
  const reEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!reEmail.test(email)) {
    res.status(500).json({
      errorMessage: 'Please enter a valid email address'
    });
    return;
  }

  User.findOne({email})
    .then(user => {
      //check if the password that the user typed is the same that already exists in DB
      bcrypt.compare(password, user.password)
      .then (passwordMatch => {
        //if both password match
        if (passwordMatch) {
          user.password = "***";
          req.session.loggedInUser = user;
          res.status(200).json(user)
        }
        //if both passwords don't match
        else {
          res.status(500).json({
            error: "Your password is wrong"
          })
          return
        }
      })
      .catch(() => {
        res.status(500).json({
          error: 'Something went wrong. Please try again',
      })
        return;    
      })
    })
    .catch((err) => {
      res.status(500).json({
        error: 'Email does not exist',
        message: err
      })
      return;  
    })
})

router.post('/logout', (req, res) => {
  req.session.destroy();
  // Nothing to send back to the user
  res.status(204).json({});   
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