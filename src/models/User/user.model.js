import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String,
    }
} , {timestamps: true})

UserSchema.pre("save" , async function(next) {
    if(!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password , 10);
})

UserSchema.methods.checkPassword = async function(password) {
    return await bcrypt.compare(password , this.password);
}

UserSchema.methods.generateAccessToken = async function(){
    return await jwt.sign(
        {
            _id : this._id,
            name : this.name,
            check : this.check,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

UserSchema.methods.generateRefreshToken = async function(){
    return jwt.sign(
        {
            _id : this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User" , UserSchema);