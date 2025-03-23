import { User } from "../models/userModel.js";
import { Post } from "../models/postModel.js";
import { generateToken } from "../utilities/generateToken.js";
import { uploadCloudinary } from "../utilities/cloudinary.js";
import { sendVerificationEamil,senWelcomeEmail } from "../email/email.js";

const registerUser = async (req, res) => {
    try {
        const { Name, Email, Password} = req.body;
        if (!Name || !Email || !Password) {
            return res.status(400).json({ message: "Submit all fields Please" });
        }
        const exsitedUser = await User.findOne({ Email });
        if (exsitedUser) {
            if (!exsitedUser.isVerified) {
                await User.findByIdAndDelete(exsitedUser._id);
            } else {
                return res.status(401).json({ message: "This user already exists." });
            }
        }        
        let avatar = null;
        if (req.files?.avatar && Array.isArray(req.files.avatar) && req.files.avatar[0]) {
            try {
                const avatarUploadResult = await uploadCloudinary(req.files.avatar[0].path);
                if (!avatarUploadResult?.url) {
                    return res.status(500).json({ message: "Failed to upload avatar." });
                }
                avatar = avatarUploadResult.url;
            } catch (uploadError) {
                console.error("Avatar Upload Error:", uploadError);
                return res.status(500).json({ message: "Error uploading avatar." });
            }
        }
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
        const user = await User.create({ Name:Name, Email:Email, Password:Password, avatar:avatar,verificationCode:verificationCode });
        const createdUser = await User.findById(user._id).select("-Password -refreshToken");
        if(!createdUser){
            return res.status(405).json({message:"Something went wrong during the creating User"})
        }
        await sendVerificationEamil(user.Email,verificationCode)

        return res.status(201).json({ message: "User registered successfully.", user: createdUser });
    } catch (error) {
        console.error("Register Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const verifyEmail = ('/emailverify',async(req,res)=>{
    const {code}=req.body 
    try {
        const user= await User.findOne({
            verificationCode:code,
        })
        if (!user) {
            return res.status(400).json({message:"Inavlid or Expired Code"})
            }
          
     user.isVerified=true;
     await user.save()
     await senWelcomeEmail(user.Email,user.Name)
     return res.status(200).json({success:true,message:"Email Verifed Successfully"})
           
    } catch (error) {
        console.log(error)
        return res.status(400).json({success:false,message:"internal server error"})
    }
}
)

const loginUser = async (req, res) => {
    try {
        const { Email, Password } = req.body;
        if (!Email || !Password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ Email });
        if(!user){
            return res.status(403).json({message:"User not found"})
        }
        if ( !(await user.isPasswordCorrect(Password))) {
            return res.status(400).json({ message: "Password is incorrect" });
        }

        const { accessToken, refreshToken } = await generateToken(user._id);
        return res.status(200)
            .cookie("accessToken", accessToken)
            .cookie("refreshToken", refreshToken)
            .json({ message: "User logged in successfully.", user ,accessToken,refreshToken});// change is made in sending the refreshToken and the accessToken due to confidentiality
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const logoutUser = async (req, res) => {
    try {
        return res.status(200)
            .clearCookie("accessToken") 
            .clearCookie("refreshToken") 
            .json({ message: "Successfully logged out. Come back soon!" });
    } catch (error) {
        console.error("Logout Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const deleteUser = async (req, res) => {
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
}

const getUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const findUser = await User.findById(userId).populate('Posts');
        
        if (!findUser) {
            return res.status(404).json({ message: "User not found in the Database" });
        }

        return res.status(200).json(findUser);
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};


export {registerUser,loginUser,logoutUser,deleteUser,getUser,verifyEmail}