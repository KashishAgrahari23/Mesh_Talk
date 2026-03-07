import { Router } from 'express';
import { loginUser, myProfile, updateName, verifyUser } from '../controllers/userController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.post("/login" , loginUser)
router.post("/verify", verifyUser)
router.get("/profile" , authMiddleware , myProfile)
router.post("/updateName" , authMiddleware , updateName)


export default router;
