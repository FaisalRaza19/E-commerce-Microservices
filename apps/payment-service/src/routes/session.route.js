import { Hono } from "hono";
import stripe from "../utils/stripe.js";
// import { authUser } from "../middleware/auth_middleware.js";
import { getStripeProductPrice } from "../utils/stripeProduct.js";

export const sessionRoute = new Hono()


sessionRoute.post("/create-checkout-session", async (c) => {
  const { cart } = await c.req.json();
  // const userId = c.get("userId");
  const userId = "user_33xtc9sxZfPR5UpCCWUYZRUf4y9"

  if (!cart || !Array.isArray(cart)) {
    return c.json({ error: "Cart must be an array" }, 400);
  }

  const lineItems = await Promise.all(
    cart.map(async (item) => {
      console.log(item)
      const unitAmount = await getStripeProductPrice(item.id);
      console.log("unitamount",unitAmount)
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
          },
          unit_amount: unitAmount,
        },
        quantity: item.quantity || 1,
      };
    })
  );

  console.log("items", lineItems)

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      client_reference_id: userId,
      mode: "payment",
      ui_mode: 'custom',
      return_url:
        "http://localhost:3000/return?session_id={CHECKOUT_SESSION_ID}",
    });

    console.log("session", session);

    return c.json({ checkoutSessionClientSecret: session.client_secret });
  } catch (error) {
    console.log(error);
    return c.json({ error });
  }
});

sessionRoute.get("/:session_id", async (c) => {
  const { session_id } = c.req.param();
  const session = await stripe.checkout.sessions.retrieve(
    session_id,
    {
      expand: ["line_items"],
    }
  );

  // console.log(session);

  return c.json({
    status: session.status,
    paymentStatus: session.payment_status,
  });
});
