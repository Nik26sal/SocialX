import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
        trim: true
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
    refreshToken: {
        type: String
    },
    TotalLikes:{
        type:Number,
        default:0
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

// Hashing Password Before Saving the User
userSchema.pre('save', async function (next) {
    if (this.isModified('Password')) {
        const saltRounds = 10;
        this.Password = await bcrypt.hash(this.Password, saltRounds);
    }
    next();
});

// Method to check if the Password is correct
userSchema.methods.isPasswordCorrect = async function (Password) {
    return await bcrypt.compare(Password, this.Password);
};

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

export const User = mongoose.model('User', userSchema);
