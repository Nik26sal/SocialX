import { User } from "../models/userModel.js";
import { Post } from "../models/postModel.js";
import { uploadCloudinary } from '../utilities/cloudinary.js';

const uploadPost = async (req, res) => {
    try {
        const { Content, description } = req.body;
        let mediaURL = null;
        let Type = null;
        if (req.files && req.files.mediaURL) {
            const file = req.files.mediaURL[0];
            try {
                Type = file.mimetype.includes('image')?'image':'video';
                const uploadResponse = await uploadCloudinary(file.path); 
                mediaURL = uploadResponse.url;
            } catch (uploadError) {
                return res.status(500).json({ message: "Failed to upload media.", error: uploadError.message });
            }
        }
        if (!Content && !mediaURL) {
            return res.status(400).json({ message: "Post must have either text or media." });
        }
        if(mediaURL === null){
            Type = 'text'
        }
        const post = await Post.create({
            Type:Type,
            Content,
            description: description || "",
            mediaURL,
            User: req.user._id
        });
        await User.findByIdAndUpdate(req.user._id, { $push: { Posts: post._id } }, { new: true });

        return res.status(201).json({ message: "Post created successfully.", post });
    } catch (error) {
        console.error("Error creating post:", error);
        return res.status(500).json({ message: "Something went wrong while creating the post.", error: error.message });
    }
}

const deletePost = async (req, res) => {
    try {
        const postId = req.params.postId.trim();
        const post = await Post.findOneAndDelete({ _id: postId, User: req.user._id });
        if (!post) {
            return res.status(404).json({ message: "Post not found or does not belong to user" });
        }
        await User.findByIdAndUpdate(req.user._id, { $pull: { Posts: postId } },{new:true});
        
        return res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error("Error deleting post:", error);
        return res.status(500).json({ message: 'Server error' });
    }
}

const getAll = async (req, res) => {
    try {
        const posts = await Post.find().populate('User','Name avatar');
        console.log(posts);
        return res.status(202).json({ post: posts });
    } catch (error) {
        return res.status(501).json({message:"something went error"})
        
    }
}

const usersPost =  async (req, res) => {
    try {
        const userPosts = await Post.find({ User: req.user._id }).populate('Likes');
        return res.status(200).json({ message: "User's posts retrieved successfully", userPosts });
    } catch (error) {
        console.error("Error fetching user's posts:", error);
        return res.status(500).json({ message: "Error retrieving posts for the user" });
    }
}
export {uploadPost,deletePost,getAll,usersPost}