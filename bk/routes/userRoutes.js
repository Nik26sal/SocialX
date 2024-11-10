import { Router } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import { Post } from "../models/postModel.js";

const router = Router();
//Generate Tokens 
const generateToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        console.log(user);
        const accessToken = await user.generateAccessToken ();
        const refreshToken = await user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (error) {
        console.error("Error generating tokens:", error);
        throw error; 
    }
};

// Middleware for Verifying JWT
const verifyJWT = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken.id).select("-Password -refreshToken");
        if (!user) {
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error);
        return res.status(403).json({ message: "Forbidden: Invalid or expired token" });
    }
};

// 1. Registration
router.post("/register", async (req, res) => {
    try {
        const { Name, Email, Password } = req.body;
        if (!Name || !Email || !Password) {
            return res.status(400).json({ message: "Submit all fields Please" });
        }

        const exsitedUser = await User.findOne({ Email });
        if (exsitedUser) {
            return res.status(401).json({ message: "This user is already existed........." });
        }

        const user = await User.create({ Name, Email, Password });
        const createdUser = await User.findById(user._id).select("-Password -refreshToken");

        return res.status(201).json({ message: "User registered successfully.", user: createdUser });
    } catch (error) {
        console.error("Register Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

// 2. Login
router.post("/login", async (req, res) => {
    try {
        const { Email, Password } = req.body;
        console.log(Email+" "+Password)
        if (!Email || !Password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ Email });
        if(!user){
            return res.status(403).json({message:"User not found"})
        }
        console.log(user)
        if ( !(await user.isPasswordCorrect(Password))) {
            return res.status(400).json({ message: "Password is incorrect" });
        }

        const { accessToken, refreshToken } = await generateToken(user._id);
        return res.status(200)
            .cookie("accessToken", accessToken)
            .cookie("refreshToken", refreshToken)
            .json({ message: "User logged in successfully.", user ,accessToken,refreshToken});
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

// 3. Logout
router.post("/logout", verifyJWT, async (req, res) => {
    try {
        console.log(req.user)
        await User.findByIdAndUpdate(req.user._id);
        
        return res.status(200)
            .clearCookie("accessToken") 
            .clearCookie("refreshToken") 
            .json({ message: "Successfully logged out. Come back soon!" });
    } catch (error) {
        console.error("Logout Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});


// 4. Delete Account
router.post("/deleteAccount", verifyJWT, async (req, res) => {
    try {
        await Post.deleteMany({ User: req.user._id });
        const deletedUser = await User.findByIdAndDelete(req.user._id);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found or already deleted" });
        }
        return res.status(200).json({ message: "Account and associated posts deleted successfully." });
    } catch (error) {
        console.error("Error deleting account and posts:", error);
        return res.status(500).json({ message: "Sorry, something went wrong during account deletion." });
    }
});

// 5. Create Post
router.post("/uploadPost", verifyJWT, async (req, res) => {
    try {
        const { Content } = req.body;
        if (!Content || Content.trim() === "") {
            return res.status(400).json({ message: "Content cannot be empty" });
        }

        const post = await Post.create({ Content, User: req.user._id });
        await User.findByIdAndUpdate(req.user._id, { $push: { Posts: post._id } }, { new: true });

        return res.status(201).json({ message: "Post created successfully.", post });
    } catch (error) {
        console.error("Error creating post:", error);
        return res.status(500).json({ message: "Something went wrong while creating the post." });
    }
});

// 6. Delete Post
router.post('/deletePost/:postId', verifyJWT, async (req, res) => {
    try {
        const postId = req.params.postId.trim();
        const post = await Post.findOneAndDelete({ _id: postId, User: req.user._id });
        if (!post) {
            return res.status(404).json({ message: "Post not found or does not belong to user" });
        }
        await User.findByIdAndUpdate(req.user._id, { $pull: { Posts: postId } });
        
        return res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error("Error deleting post:", error);
        return res.status(500).json({ message: 'Server error' });
    }
});

// 6.Get All Post
router.get('/getAllPost', verifyJWT, async (req, res) => {
    try {
        console.log("get your all post by me")
        const posts = await Post.find().populate('User','Name');
        console.log(posts);
        return res.status(202).json({ post: posts });
    } catch (error) {
        return res.status(501).json({message:"something went error"})
    }
});

// 7.Like a Post
router.post('/likesOnPost/:postId', verifyJWT, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({ message: "Post Not Found" });
        }

        const userId = req.user._id;
        const hasLiked = post.Likes.includes(userId);

        if (hasLiked) {
            return res.status(200).json({ message: "You have already liked this post" });
        }
        post.Likes.push(userId);
        await post.save();

        return res.status(201).json({ message: "Post liked successfully" });
    } catch (error) {
        console.error("Error liking post:", error);
        return res.status(500).json({ message: "Something went wrong while liking the post." });
    }
});

// 8.Total Likes on a Post
router.get('/likes/:postId', verifyJWT, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        const totalLikes = post.Likes.length;
        return res.status(200).json({ totalLikes });
    } catch (error) {
        console.error("Error fetching total likes:", error);
        return res.status(500).json({ message: "Something went wrong while fetching total likes." });
    }
});

// 9. Return Posts Liked by User
router.get('/returnpost', verifyJWT, async (req, res) => {
    try {
        console.log("Fetching liked posts for user:", req.user._id);
        const likedPosts = await Post.find({ Likes: req.user._id });
        return res.status(200).json({ likedPosts });
    } catch (error) {
        console.error("Error fetching liked posts:", error);
        return res.status(500).json({ message: "Something went wrong while fetching liked posts." });
    }
});


// 10. Get All Posts of Logged-In User
router.get('/userPosts', verifyJWT, async (req, res) => {
    try {
        const userPosts = await Post.find({ User: req.user._id }).populate('Likes');
        return res.status(200).json({ message: "User's posts retrieved successfully", userPosts });
    } catch (error) {
        console.error("Error fetching user's posts:", error);
        return res.status(500).json({ message: "Error retrieving posts for the user" });
    }
});

//11.Unlike route
router.post('/unlikepost/:postId',verifyJWT,async(req,res)=>{
    try {
        const post = await Post.findById({_id:req.params.postId})
        if(!post){
            return res.status(405).json({message:"post NOt found"});
        }
        if(!post.Likes.includes(req.user._id)){
            return res.status(400).json({ message: "post not yet liked." });
        }
        post.Likes = post.Likes.filter(id => !id.equals(req.user._id));
            await post.save();
    
            return res.status(200).json({ message: "post unliked successfully." });
    } catch (error) {
        console.error("Unlike Video Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
})

export default router;