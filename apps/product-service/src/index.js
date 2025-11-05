import express from "express"
import { clerkMiddleware } from '@clerk/express'
import { userAuth } from "./middleware/auth_middleware.js"
import productRouter from "./routes/product.route.js";
import categoryRouter from "./routes/category.route.js";
import { producer} from "./utils/kafka.js";
import cors from "cors"

const app = express()

app.use(clerkMiddleware())

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);

app.get("/test", userAuth, (req, res) => {
    return res.json({ message: "Product service authenticated", userId: req?.userId })
})

app.use("/products", productRouter);
app.use("/categories", categoryRouter);

app.use((err, req, res, next) => {
    console.log(err);
    return res
        .status(err.status || 500)
        .json({ message: err.message || "Inter Server Error!" });
});

app.use("/", (req, res) => {
    res.send("Hello Product service")
})

const port = process.env.PORT
const start = async () => {
    try {
        await producer.connect();
        app.listen(port, () => {
            console.log(`Product service is running on http://localhost:${port}`);
        });
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

start()