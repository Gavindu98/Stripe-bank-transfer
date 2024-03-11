require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(express.json());
app.use(cors());

// Endpoint to create a Connect account link for onboarding
app.post('/create-account-link', async (req, res) => {
  try {
    const accountLink = await stripe.accountLinks.create({
      account: req.body.accountId,
      refresh_url: 'http://localhost:3000/reauth',
      return_url: 'http://localhost:3000/return',
      type: 'account_onboarding',
    });
    res.send({url: accountLink.url});
  } catch (error) {
    res.status(500).send({error: error.message});
  }
});

// Endpoint to perform a payout
app.post('/payout', async (req, res) => {
  try {
    const payout = await stripe.payouts.create({
      amount: req.body.amount,
      currency: 'usd',
    }, {
      stripeAccount: req.body.accountId,
    });
    res.send(payout);
  } catch (error) {
    res.status(500).send({error: error.message});
  }
});

const PORT = process.env.PORT || 9090;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
