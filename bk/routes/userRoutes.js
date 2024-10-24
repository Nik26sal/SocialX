import { Router } from "express";
import jwt  from "jsonwebtoken";
import { User } from '../models/userModel.js'
import { Post } from '../models/postModel.js'
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

// middleWare/verifyUser.js
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


//1.Registration of User 
router.post("/register", async (req, res) => {
    try {
        const { Name, Email, Password } = req.body;

        if (!Name || !Email || !Password) {
            return res.status(401).json({ message: "Submit all fields Please" })
        }

        const exsitedUser = await User.findOne({ Email });

        if (exsitedUser) {
            return res.status(401).json({ message: "This user is already existed........." })
        }

        const user = await User.create({
            Name,
            Email,
            Password
        })

        const createdUser = await User.findById(user._id).select('-Password -refreshToken')

        if (!createdUser) {
            return res.status(500).json({ message: "Server error during registration. Please try again later." });
        }

        return res.status(201).json({ message: "User registered successfully.", user: createdUser });

    } catch (error) {

        console.error("Register Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });

    }
})
//2.Login of User
router.post("/login", async (req, res) => {
    try {
        const { Email, Password } = req.body;
        console.log(Email+"  " + Password);
        if (!Email || !Password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ Email });
        if (!user) {
            return res.status(400).json({ message: "User not registered. Please register first." });
        }
        console.log(user);
        const validatePassword = await user.isPasswordCorrect(Password);
        console.log(validatePassword)
        if (!validatePassword) {
            return res.status(400).json({ message: "Password is incorrect" });
        }

        const { accessToken, refreshToken } = await generateToken(user._id);

        const loggedInUser = await User.findById(user._id).select('-password -refreshToken');
        return res.status(200)
            .cookie("accessToken", accessToken)
            .cookie("refreshToken", refreshToken)
            .json({
                user: loggedInUser,
                message: "User logged in successfully."
            });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

//Logout User
router.post("/logout", verifyJWT, async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user._id, { isLoggedIn: false }); 

        return res.status(200)
            .clearCookie("accessToken")
            .clearCookie("refreshToken")
            .json({ message: "Successfully logged out. Come back soon!" });
    } catch (error) {
        console.error("Logout Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

//create Post
router.post("/uploadPost", verifyJWT, async (req, res) => {
    try {
        const { Content } = req.body;
        if (!Content || Content.trim() === "") {
            return res.status(400).json({ message: "Content cannot be empty" });
        }

        const post = await Post.create({
            Content,
            user: req.user._id
        });

        return res.status(201).json({
            message: "Post created successfully.",
            post: post
        });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({
            message: "Something went wrong while creating the post"
        });
    }
});

export default router;