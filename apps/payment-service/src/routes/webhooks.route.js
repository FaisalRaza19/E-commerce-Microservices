import { Hono } from "hono";
import { producer } from "../utils/kafka.js";
import stripe from "../utils/stripe.js";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const webhookRoute = new Hono();

webhookRoute.post("/stripe", async (c) => {
    const body = await c.req.text();
    const sig = c.req.header("stripe-signature");

    let event;

    try {
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
        console.log("event",event)
    } catch (error) {
        console.log("Webhook verification failed!");
        return c.json({ error: "Webhook verification failed!" }, 400);
    }

    switch (event.type) {
        case "checkout.session.completed":
            const session = event.data.object;
            console.log(session)

            const lineItems = await stripe.checkout.sessions.listLineItems(
                session.id
            );
            console.log("lineitem",lineItems)

            const successfulPaymentMessage = {
                userId: session.client_reference_id,
                email: session.customer_details?.email,
                amount: session.amount_total,
                status: session.payment_status === "paid" ? "success" : "failed",
                products: lineItems.data.map((item) => ({
                    name: item.description,
                    quantity: item.quantity,
                    price: item.price?.unit_amount,
                })),
            };

            console.log("successpayment",successfulPaymentMessage)

            await producer.send("payment.successful", successfulPaymentMessage);

            break;

        default:
            console.log(`Unhandled Stripe event type: ${event.type}`);
            break;
    }
    return c.json({ received: true });
});

export default webhookRoute;
