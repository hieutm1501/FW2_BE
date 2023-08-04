import { Router } from "express";
import { getAllUser, signin, signup } from "../controllers/auth";

const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/user", getAllUser)

export default router;