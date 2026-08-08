import { Router } from "express";
import {
  createOrder,
  getAllOrders,
  getMyOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { developerOnly, protect } from "../middleware/auth.js";

const router = Router();

router.post("/", protect, createOrder);
router.get("/mine", protect, getMyOrders);
router.get("/", protect, developerOnly, getAllOrders);
router.patch("/:id/status", protect, developerOnly, updateOrderStatus);

export default router;
