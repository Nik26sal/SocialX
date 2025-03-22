import mongoose from 'mongoose';


const postSchema = new mongoose.Schema({
    Type: {
        type: String,
        enum: ['text', 'image', 'video'],
        required: true
    },
    Content: {
        type: String,
        trim: true
    },
    mediaURL: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    Likes: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    ],
    User: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }
}, { timestamps: true });

export const Post = mongoose.model('Post', postSchema);
