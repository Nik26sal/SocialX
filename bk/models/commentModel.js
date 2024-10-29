import mongoose from "mongoose";
const commentSchema = new mongoose.Schema({
    Content: {
        type: String,
        required: true,
        trim: true
    },
    User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    Post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    }
}, {
    timestamps: true
});

export const Comment = mongoose.model('Comment',commentSchema);
