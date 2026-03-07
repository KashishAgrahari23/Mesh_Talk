import { Router } from 'express';
import { loginUser, myProfile, verifyUser } from '../controllers/userController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.post("/login" , loginUser)
router.post("/verify", verifyUser)
router.get("/profile" , authMiddleware , myProfile)

export default router;
