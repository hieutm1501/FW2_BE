import express from "express";
import productRouter from "./routes/product";
import authRouter from "./routes/auth";
import cartRouter from "./routes/cart";
import billRouter from "./routes/bill";
import categoryRouter from "./routes/catagory";
import mongoose from "mongoose";
import cors from "cors"


const app = express();
app.use(cors());

app.use(express.json());

// router
app.use("/api", productRouter);
app.use("/api", categoryRouter);
app.use("/api", authRouter);
app.use("/api", cartRouter);
app.use("/api", billRouter);


mongoose.connect(process.env.API_DB);

export const viteNodeApp = app;