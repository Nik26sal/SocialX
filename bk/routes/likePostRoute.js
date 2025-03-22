import { Router } from "express";
import { verifyJWT } from "../utilities/verifyJWT.js";
import { likedUserPost, likePost, totalLikes,unlikePost } from "../Controllers/likesController.js";
const router = Router();

router.patch('/likesOnPost/:postId', verifyJWT, likePost);
router.get('/likes/:postId', verifyJWT, totalLikes);
router.get('/returnpost', verifyJWT, likedUserPost);
router.post('/unlikepost/:postId',verifyJWT,unlikePost)

export default router;

