import express from "express"

const app = express()

app.use("/",(req,res)=>{
    res.send("Hello Product service")
})

const port = process.env.PORT
app.listen(port || 3000, () => {
    console.log(`app running on port http://localhost:${port}`)
})