import Fastify from "fastify"
import { clerkPlugin} from '@clerk/fastify'
import { userAuth } from "./middleware/auth_middleware.js";

const fastify = Fastify();

fastify.register(clerkPlugin)

fastify.get("/test", {preHandler : userAuth},(req, res) => {
    return res.send({ message: "order service authenticated",userId:req.userId})
})

fastify.get("/", (req, res) => {
    res.send("Hello Order service")
})

const port = process.env.PORT
const start = () => {
    try {
        fastify.listen({ port })
        console.log(`fastify app is running on port http://localhost:${port}`)
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start()