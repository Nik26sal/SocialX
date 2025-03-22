import { Router } from "express";
import { verifyJWT } from "../utilities/verifyJWT.js";
import { commentRoute, removeComment, returnAllComment } from "../Controllers/commentController.js";

const router = Router();

router.post('/commentOnPost/:postId',verifyJWT,commentRoute)
router.delete('/deleteComment/:postId/:commentId',verifyJWT,removeComment)
router.get('/returnAllComment',verifyJWT,returnAllComment)

export default router;