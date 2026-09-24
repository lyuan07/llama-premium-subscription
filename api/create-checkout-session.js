const Stripe = require('stripe');
const CHECKOUT_PRICE_ID = 'price_1UJ2YMBYgVWOtDQRHXXTzhUZ';

module.exports = async function createCheckoutSession(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).send('Method not allowed');
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('Missing required Checkout configuration', {
      hasStripeSecretKey: Boolean(process.env.STRIPE_SECRET_KEY),
    });
    return res.status(500).send('Checkout is temporarily unavailable.');
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const siteUrl = (process.env.SITE_URL || `https://${req.headers.host}`).replace(/\/$/, '');

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      submit_type: 'subscribe',
      line_items: [
        {
          price: CHECKOUT_PRICE_ID,
          quantity: 1,
        },
      ],
      managed_payments: {
        enabled: false,
      },
      success_url: `${siteUrl}/success/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/cancel/`,
      integration_identifier: 'llama_premium_web',
    });

    res.setHeader('Location', session.url);
    return res.status(303).end();
  } catch (error) {
    console.error('Unable to create Checkout Session', {
      message: error.message,
      requestId: error.requestId,
    });
    return res.status(500).send('Checkout is temporarily unavailable. Please try again.');
  }
};
