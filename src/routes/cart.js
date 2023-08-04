import express from "express";
import { addToCart, deleteProductCart, getCart, getCarts } from "../controllers/cart";
import { authenticate } from "../middlewares/authenticate";

const router = express.Router();

router.get("/cart/user", authenticate, getCart);
router.get("/cart", getCarts);
router.post("/cart/add", authenticate, addToCart);
router.delete("/cart/delete/:productId", authenticate, deleteProductCart);

export default router;