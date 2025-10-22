import { Hono } from "hono";
// import Stripe from "stripe";
import stripe from "../utils/stripe.js";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const webhookRoute = new Hono();

webhookRoute.post("/stripe", async (c) => {
  const body = await c.req.text();
  const sig = c.req.header("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (error) {
    console.log("Webhook verification failed!");
    return c.json({ error: "Webhook verification failed!" }, 400);
  }

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;

      const lineItems = await stripe.checkout.sessions.listLineItems(
        session.id
      );

      break;

    default:
      break;
  }
  return c.json({ received: true });
});

export default webhookRoute;