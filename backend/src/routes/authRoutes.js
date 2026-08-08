import { Router } from "express";
import { developerLogin, getMe, login, register } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/developer/login", developerLogin);
router.get("/me", protect, getMe);

export default router;
