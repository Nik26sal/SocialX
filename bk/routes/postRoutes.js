import { deletePost, getAll, uploadPost,usersPost } from "../Controllers/postController.js";
import { verifyJWT } from "../utilities/verifyJWT.js";
import {Router} from "express";
import { upload } from "../utilities/multer.js";

const router = Router();

router.post("/uploadPost", verifyJWT,upload.fields([{name:'mediaURL',maxCount:1}]),uploadPost);
router.post('/deletePost/:postId', verifyJWT, deletePost);
router.get('/getAllPost', verifyJWT, getAll);
router.get('/userPosts', verifyJWT,usersPost);

export default router;
