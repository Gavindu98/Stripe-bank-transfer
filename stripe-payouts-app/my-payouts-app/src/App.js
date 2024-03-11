import logo from './logo.svg';
import './App.css';
const stripe = require('stripe')('stripe_secret_key');

function App() {

  const handleOnboarding = async () => {
    const accountId = "acct_1NTbd4RNBBSuIHHi"
    const response = await fetch('http://localhost:9090/create-account-link', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ accountId }),
    });
    const data = await response.json();
    // window.location.href = data.url;
  };

  async function createStripeConnectAccount() {
    try {
      const account = await stripe.accounts.create({
        type: 'express', // or 'custom', depending on your needs
        country: 'US',
        email: 'user@example.com',
        capabilities: {
          card_payments: {requested: true},
          transfers: {requested: true},
        },
      });
  
      console.log(account.id); // This is the accountId you're asking about
      return account.id;
    } catch (error) {
      console.error('Error creating Stripe account:', error);
      throw error;
    }
  }

  async function getUserBankAccountId() {
    try {
      const account = await stripe.accounts.retrieve('acct_1NTbd4RNBBSuIHHi');
      const bankAccountId = account.external_accounts.data[0].id;
      console.log("Bank account ID:", bankAccountId);
      return bankAccountId;
    } catch (error) {
      console.error("Error retrieving bank account ID:", error);
      throw error; // Handle error appropriately in your application
    }
  }
  return (
    <>
    <button onClick={getUserBankAccountId}>Get bank Account Id</button>
    <br></br>
    <button onClick={handleOnboarding}>Start Onboarding</button>
    </>
  );
}

export default App;
