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
