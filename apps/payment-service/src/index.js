import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { clerkMiddleware, } from '@hono/clerk-auth'
import { sessionRoute } from "./routes/session.route.js";
import { cors } from "hono/cors";
import { createStripeProduct } from './utils/stripeProduct.js';
import webhookRoute from './routes/webhooks.route.js';
const app = new Hono()

app.use("*", clerkMiddleware());
app.use("*", cors({ origin: ["http://localhost:3000"] }));

app.route("/sessions", sessionRoute);
app.route("/webhooks", webhookRoute);

// testing purpose
app.post("/create-product", async (c) => {
  try {
    const body = await c.req.json();
    const { cart } = body;

    if (!cart || !Array.isArray(cart)) {
      return c.json({ error: "Cart array is required" }, 400);
    }

    const createdProducts = [];

    for (const item of cart) {
      if (!item.name || !item.price) {
        throw new Error(`Missing 'name' or 'price' for item: ${JSON.stringify(item)}`);
      }

      // Create product on Stripe
      const product = await createStripeProduct(item)

      createdProducts.push(product);
    }

    return c.json({ success: true, products: createdProducts });
  } catch (err) {
    console.error("Stripe Product Creation Error:", err);
    return c.json({ error: err.message || "Something went wrong" }, 500);
  }
});


app.get('/', (c) => {
  return c.text('Hello payment service')
})

const start = async () => {
  try {
    serve({
      fetch: app.fetch,
      port: process.env.PORT
    }, (info) => {
      console.log(`Server is running on http://localhost:${info.port}`)
    })
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

start()