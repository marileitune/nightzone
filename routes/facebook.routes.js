const router = require("express").Router();
const User = require('../models/User.model')

// The client makes a API request to this url sending the data in the body
router.post("/facebook/info", async (req, res, next) => {
  try {
    // the name itself will include the last name
    const {name, email, imageAccount, facebookId} = req.body
    //need to check if the user already exists in DB
    let user = await User.findOne({email})
    if (user) {
      req.session.loggedInUser = user
      return res.status(200).json({data: user})
    }

    // Create the user in the DB
    console.log(imageAccount)
    user = await User.create({firstName: name, facebookId, imageAccount, email})
    req.session.loggedInUser = user
    return res.status(200).json({data: user})
  }
  catch(error) {
    res.status(500).json({error: `${error}`})
  }
});

module.exports = router;