import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express from "express";
import { auth } from "./lib/auth";
import { adminRouter } from "./modules/admin/admin.route";
import { categoryRouter } from "./modules/category/category.router";
import { courseRouter } from "./modules/course/course.router";
import { instructorProfilesRouter } from "./modules/instructor/instructor-profiles.route";
import { instructorRouter } from "./modules/instructor/instructor.route";
import { orderRouter } from "./modules/order/order.route";
import { reviewRouter } from "./modules/review/review.router";
import { userRouter } from "./modules/user/user.router";

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  process.env.APP_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());

app.use("/api/auth", toNodeHandler(auth));

// ── Custom routes ─────────────────────────────────────
app.use("/courses", courseRouter);                         // was: /meals
app.use("/categories", categoryRouter);
app.use("/instructor", instructorRouter);
app.use("/instructor-profiles", instructorProfilesRouter);
app.use("/orders", orderRouter);
app.use("/users", userRouter);
app.use("/reviews", reviewRouter);
app.use("/admin", adminRouter);
// ─────────────────────────────────────────────────────

app.get("/", (req, res) => {
  res.send("KitchenClass API is running! 🍳");
});

export default app;
