const router = require("express").Router();
const stripe = require("stripe")("sk_test_51JFxmQGLw6mfE9Jv2jHD2UDRnsJOowQrMScPHEyoHcr5plWIZ3I5dhsljSIxptYuP06GYbt02XA83FHky7MYmFdi00psE6lFXM")
const Event = require('../models/Event.model')

// const calculateOrderAmount = ticket => {
//   // Replace this constant with a calculation of the order's amount
//   // Calculate the order total on the server to prevent
//   // people from directly manipulating the amount on the client
//   return 1400;
// };

router.post("/create-payment-intent", async (req, res) => {
  try {
    const { eventId } = req.body;
    const response = await Event.findById({_id: eventId})//we are looking for the event to grab the ticketsPrice from the DB, so the user can't modify in the front to pay less.
    const ticketPrice = response.ticketsPrice*100// we need to multiply because for stripe 12 = 0012, so it would be 0,12 cents.
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: ticketPrice,
      currency: "eur"
      });
  
    res.send({
      clientSecret: paymentIntent.client_secret
    });
  }
  catch(err) {
    return   res.status(500).json({
            error: 'Something went wrong',
            message: err
        })
  }
});


module.exports = router;