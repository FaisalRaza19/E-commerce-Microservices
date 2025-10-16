import { Router } from "express";
import {createCategory,deleteCategory,getCategories,updateCategory,} from "../controllers/category.controller.js";
// import { userAuth } from "../middleware/auth_middleware.js";

const router = Router();

router.post("/",createCategory);
router.put("/:id",updateCategory);
router.delete("/:id", deleteCategory);
router.get("/", getCategories);

export default router;