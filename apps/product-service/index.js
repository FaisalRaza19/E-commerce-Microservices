import express from "express"
import { clerkMiddleware} from '@clerk/express'
import { userAuth } from "./middleware/auth_middleware.js"

const app = express()

app.use(clerkMiddleware())


app.get("/test", userAuth,(req, res) => {
    return res.json({ message: "Product service authenticated",userId:req?.userId})
})

app.use("/", (req, res) => {
    res.send("Hello Product service")
})

const port = process.env.PORT
app.listen(port, () => {
    console.log(`app running on port http://localhost:${port}`)
})