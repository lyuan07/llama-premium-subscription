# Llama Premium subscription

A small, public test integration for Llama Inc.'s Stripe Checkout subscription flow.

Live demo: https://llama-premium-subscription.vercel.app

The site includes:

- A landing page with a monthly subscription button
- A server-side endpoint that creates a Stripe Checkout Session in test mode
- A confirmation page after a completed test purchase
- A cancel page with a return path

## How it works

The subscription button sends a POST request to `api/create-checkout-session.js`. The endpoint uses Stripe's Node library to create a Checkout Session for the monthly Price, then redirects the customer to Stripe-hosted Checkout.

The deployment requires two environment variables:

- `STRIPE_SECRET_KEY`: a Stripe test-mode secret key
- `STRIPE_PRICE_ID`: the recurring test Price used by the subscription

No credentials or real customer data are stored in this repository.
