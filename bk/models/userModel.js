import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
        trim: true
    },
    avatar:{
        type:String,
        required:true
    },
    Password: {
        type: String,
        required: true,
        minlength: 6
    },
    Email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },
    verificationCode:{
        type:Number
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    refreshToken: {
        type: String
    },
    Posts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Post'
        }
    ]
}, {
    timestamps: true
});

userSchema.pre('save', async function (next) {
    if (this.isModified('Password')) {
        const saltRounds = 10;
        this.Password = await bcrypt.hash(this.Password, saltRounds);
    }
    next();
});

userSchema.methods.isPasswordCorrect = async function (Password) {
    return await bcrypt.compare(Password, this.Password);
};

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

export const User = mongoose.model('User', userSchema);
