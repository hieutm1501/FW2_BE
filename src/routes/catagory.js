import express from "express";

import { create, get, getAll, getdelete, updateCategories } from "../controllers/category";
import { checkPermission } from "../middlewares/checkPermission";

const router = express.Router();
router.get("/categories", getAll);
router.get("/categories/:id", get);
router.post("/categories", create);
router.delete("/categories/:id", getdelete);
router.put("/categories/:id", updateCategories);

export default router;
