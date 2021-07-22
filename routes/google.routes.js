const router = require("express").Router();
const User = require('../models/User.model')

// The client makes a API request to this url sending the data in the body
router.post("/google/info", async (req, res, next) => {
  try {
    const {firstName, lastName, email, image, googleId} = req.body
    //need to check if the user already exist in DB
    let user = await User.findOne({email})
    if (user) {
      req.session.loggedInUser = user
      return res.status(200).json({data: user})
    }
    // Create the user in the DB
    user = User.create({firstName, lastName, googleId, imageAccount: image, email})
    req.session.loggedInUser = user
    res.status(200).json({data: user})
  }
  catch(error) {
    res.status(500).json({error: `${error}`})
  }
});

module.exports = router;