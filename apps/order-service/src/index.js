import Fastify from "fastify"
import { clerkPlugin } from '@clerk/fastify'
import { userAuth } from "./middleware/auth_middleware.js";
import { connectOrderDB } from "@repo/order-db";
import { orderRoute } from "./routes/order_route.js";
import { consumer, producer} from "./utils/kafka.js";
import { runKafkaSubscriptions } from "./utils/subscription.js";
const fastify = Fastify();


fastify.register(clerkPlugin)

fastify.register(orderRoute);

fastify.get("/test", { preHandler: userAuth }, (req, res) => {
    return res.send({ message: "order service authenticated", userId: req.userId })
})

fastify.get("/", (req, res) => {
    res.send("Hello Order service")
})

const port = process.env.PORT
const start = async () => {
    try {
        await Promise.all([connectOrderDB(), producer.connect(), consumer.connect()]);
        await runKafkaSubscriptions();
        fastify.listen({ port })
        console.log(`fastify app is running on port http://localhost:${port}`)
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start()