import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
    Content: {
        type: String,
        required: true,
        trim: true
    },
    Likes: {
        type: Number,
        default: 0
    },
    Comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},
    {
        timestamps: true
    }
);
export const Post = mongoose.model('Post', postSchema);