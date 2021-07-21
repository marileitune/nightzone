const router = require("express").Router();
const UserModel = require('../models/User.model')

// The client makes a API request to this url sending the data in the body
router.post("/facebook/info", (req, res, next) => {
  const {name, email, image, facebookId} = req.body
  // the name itself will include the last name
  try {
    // Create the user in the DB
    UserModel.create({firstName: name, facebookId, imageAccount: image, email})
      .then((response) => {
        // Save the loggedInInfo in the session
        req.session.loggedInUser = response
        res.status(200).json({data: response})
      })
  }
  catch(error) {
    res.status(500).json({error: `${error}`})
  }
});

module.exports = router;