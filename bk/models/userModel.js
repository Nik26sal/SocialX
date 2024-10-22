import mongoose, { Schema, Types } from "mongoose";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";
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
    refreshToken:{
        type:String
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
// Hashing Password Before Save the User
// Here the arrow function are not work because the this keyword in the arrow function not pointed towards the saved document but in the function expression this pointed to saved document.
userSchema.pre('save', async function (next) {
    if (this.isModified('Password')) {
        const saltRounds = 10;
        this.Password = await bcrypt.hash(this.Password, saltRounds);
    }
    next();
});

// method that check the Password is correct or not 
userSchema.method.isPasswordCorrect = async (Password)=>{
    return await bcrypt.compare(Password,this.Password);
}
// Generate Access Token
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            id: this._id,
            Name: this.Name,
            Email: this.Email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_TIMEPERIOD || '15m'
        }
    );
};
// Generate Refresh Token
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_TIMEPERIOD || '7d'
        }
    );
};

export const User = mongoose.model('User',userSchema);