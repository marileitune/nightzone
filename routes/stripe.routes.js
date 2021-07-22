const router = require("express").Router();

const stripe = require("stripe")("sk_test_51JFxmQGLw6mfE9Jv2jHD2UDRnsJOowQrMScPHEyoHcr5plWIZ3I5dhsljSIxptYuP06GYbt02XA83FHky7MYmFdi00psE6lFXM")


// const calculateOrderAmount = items => {
//   // Replace this constant with a calculation of the order's amount
//   // Calculate the order total on the server to prevent
//   // people from directly manipulating the amount on the client
//   return 1400;
// };

router.post("/create-payment-intent", async (req, res) => {
  const { ticket } = req.body;
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(ticket),
    currency: "eur"
  });
  res.send({
    clientSecret: paymentIntent.client_secret
  });
});


module.exports = router;