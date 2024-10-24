import { Router } from "express";
import { User } from '../models/userModel.js'
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

        const options = {
            httpOnly: true,
            secure: true
        };

        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({
                user: loggedInUser,
                accessToken,
                refreshToken,
                message: "User logged in successfully."
            });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

export default router;