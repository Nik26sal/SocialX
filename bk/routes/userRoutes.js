import { Router } from "express";
import { User } from '../models/userModel.js'
const router = Router();
//1.Registration of User Route
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

export default router;