import mongoose, { Schema, Types } from "mongoose";

const userSchema = new mongoose.Schema({
    Name:{
        type:String,
        required:true,
        trim:true
    },
    Password:{
        type:String,
        required:true,
        minlength:6
    },
    Email:{
        type:String,
        lowercase:true,
        unique:true,
        required:true
    },
    Posts:[
        {
            type:Schema.Types.ObjectId,
            ref:'Post'
        }
    ]
},
{
    timestamps:true
});
export const User = mongoose.model('User',userSchema);