import mongoose from "mongoose";

const likesSchema = new mongoose.Schema({
    User: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true 
    },
    Post: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true  
    }
}, {
    timestamps: true
});

export const Likes = mongoose.model('Like',likesSchema)
