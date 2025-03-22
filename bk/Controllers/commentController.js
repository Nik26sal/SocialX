import { Comment } from "../models/commentModel.js";
import { Post } from "../models/postModel.js";
const commentRoute = async (req, res) => {
    try {
        const currentUser = req.user;
        const { postId } = req.params;
        const { content } = req.body;
        const post = await Post.findOne({ _id: postId });
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        await Comment.create({
            content,
            post: post,
            user: currentUser
        });

        return res.status(201).json({ message: "Comment added successfully" });
    } catch (error) {
        console.error("Comment error:", error);
        return res.status(500).json({ message: "Something went wrong during commenting" });
    }
};


const removeComment = async (req, res) => {
    try {
        const { postId, commentId } = req.params;
        const currentUser = req.user;
        const comment = await Comment.findOne({ _id: commentId });
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        const post = await Post.findOne({ _id: postId });
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        const postOwnerId = post.user.toString();
        const commentOwnerId = comment.user.toString();
        const currentUserId = currentUser._id.toString();
        if (currentUserId !== postOwnerId && currentUserId !== commentOwnerId) {
            return res.status(403).json({ message: "You are not authorized to delete this comment" });
        }
        await Comment.findByIdAndDelete(commentId);
        return res.status(200).json({ message: "Comment deleted successfully" });

    } catch (error) {
        console.error("Error deleting comment:", error);
        return res.status(500).json({ message: "Something went wrong while deleting the comment" });
    }
};

const returnAllComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Post.findOne({ _id: postId });
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        const allComments = await Comment.find({ post: postId }).populate("user").populate('post'); 
        return res.status(200).json({ comments: allComments });
    } catch (error) {
        console.error("Error fetching comments:", error);
        return res.status(500).json({ message: "Something went wrong while retrieving comments" });
    }
};



export{commentRoute,removeComment,returnAllComment};