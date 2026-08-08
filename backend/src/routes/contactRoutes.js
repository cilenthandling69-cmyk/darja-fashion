import { Router } from "express";
import {
  createContactMessage,
  getContactMessages,
  replyToContactMessage,
  updateContactStatus,
} from "../controllers/contactController.js";
import { developerOnly, protect } from "../middleware/auth.js";

const router = Router();

router.post("/", createContactMessage);
router.get("/", protect, developerOnly, getContactMessages);
router.patch("/:id/status", protect, developerOnly, updateContactStatus);
router.patch("/:id/reply", protect, developerOnly, replyToContactMessage);

export default router;
