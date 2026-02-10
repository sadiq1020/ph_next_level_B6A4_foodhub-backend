import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express from "express";
import { auth } from "./lib/auth";
import { categoryRouter } from "./modules/category/category.router";
import { mealRouter } from "./modules/meal/meal.router";
import { orderRouter } from "./modules/order/order.route";
import { providerRouter } from "./modules/provider/provider.route";
import { userRouter } from "./modules/user/user.router";

const app = express();

// setting cors
app.use(
  cors({
    origin: process.env.APP_URL || "http://localhost:3000", // client side url
    credentials: true,
  }),
);

app.use(express.json());

app.all("/api/auth/*splat", toNodeHandler(auth));

// all custom routes
app.use("/meals", mealRouter);
app.use("/categories", categoryRouter);
app.use("/provider", providerRouter);
app.use("/orders", orderRouter);
app.use("/users", userRouter);

// test the server running
app.get("/", (req, res) => {
  res.send("hello world!");
});

export default app;
