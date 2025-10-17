import { Router } from "express";
import { createCategory, deleteCategory, getCategories, updateCategory, } from "../controllers/category.controller.js";
import { shouldBeAdmin } from "../middleware/auth_middleware.js";

const router = Router();

router.post("/", shouldBeAdmin, createCategory);
router.put("/:id", shouldBeAdmin, updateCategory);
router.delete("/:id", shouldBeAdmin, deleteCategory);
router.get("/", getCategories);

export default router;