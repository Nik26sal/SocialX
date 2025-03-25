import { Post } from "../models/postModel.js";


const likePost = async (req, res) => {
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
}
const totalLikes = async (req, res) => {
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
}

const likedUserPost = async (req, res) => {
    try {
        const likedPosts = await Post.find({ Likes: req.user._id });
        return res.status(200).json({ likedPosts });
    } catch (error) {
        console.error("Error fetching liked posts:", error);
        return res.status(500).json({ message: "Something went wrong while fetching liked posts." });
    }
}

const unlikePost = async(req,res)=>{
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
}
export {likePost,totalLikes,likedUserPost,unlikePost}