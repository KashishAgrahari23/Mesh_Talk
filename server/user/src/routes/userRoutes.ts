import { Router } from 'express';
import { loginUser, verifyUser } from '../controllers/userController.js';

const router = Router();

router.post("/login" , loginUser)
router.post("/verify", verifyUser)

export default router;
