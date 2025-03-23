import { Router } from "express";
import { verifyJWT } from "../utilities/verifyJWT.js";
import { upload } from "../utilities/multer.js";
import { deleteUser, getUser, loginUser, logoutUser, registerUser, verifyEmail } from "../Controllers/userController.js";

const router = Router();

router.post("/register",upload.fields([{name:'avatar',maxCount:1}]),registerUser);
router.post('/verifyEmail',verifyEmail)
router.post("/login", loginUser);
router.get("/logout", verifyJWT,logoutUser);
router.delete("/deleteAccount", verifyJWT, deleteUser);
router.get('/getUser/:userId',verifyJWT,getUser)
export default router;