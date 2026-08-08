import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getDeveloperProducts,
  getProduct,
  getProducts,
  updateProduct,
} from "../controllers/productController.js";
import { developerOnly, protect } from "../middleware/auth.js";

const router = Router();

router.get("/", getProducts);
router.get("/developer/all", protect, developerOnly, getDeveloperProducts);
router.get("/:identifier", getProduct);
router.post("/", protect, developerOnly, createProduct);
router.put("/:id", protect, developerOnly, updateProduct);
router.delete("/:id", protect, developerOnly, deleteProduct);

export default router;
