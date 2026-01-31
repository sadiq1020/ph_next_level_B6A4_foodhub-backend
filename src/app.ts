import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { mealRouter } from "./modules/meal/meal.router";
import { categoryRouter } from "./modules/category/category.router";
import { providerRouter } from "./modules/provider/provider.route";
import { orderRouter } from "./modules/order/order.route";

const app = express();

// setting cors 
app.use(cors({
    origin: process.env.APP_URL || "http://localhost:3000", // client side url
    credentials: true
}))

app.use(express.json());

app.all("/api/auth/*splat", toNodeHandler(auth));

// all custom routes
app.use("/posts", mealRouter);
app.use("/categories", categoryRouter);
app.use("/provider/profile", providerRouter);
app.use("/orders", orderRouter);


// test the server running 
app.get("/", (req, res) => {
    res.send("hello world!")
})

export default app;