import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    content:{
        type:String,
        trim:true
    },
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
},{
    timestamps:true,
})

export const Comment = mongoose.model('Comment',commentSchema);