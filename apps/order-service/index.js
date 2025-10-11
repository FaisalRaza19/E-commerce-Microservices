import Fastify from "fastify"

const fastify = Fastify();

fastify.get("/",(req,res)=>{
    res.send("Hello Order service")
})

const port = process.env.PORT
const start = async () => {
    try {
        await fastify.listen({ port })
        console.log(`fastify app is running on port http://localhost:${port}`)
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start()