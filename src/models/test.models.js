import mongoose from "mongoose";
import { Model } from "mongoose";
import jwt from "jsonwebtoken";

const testSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    check: {
        type: Boolean,
        required: true
    }
} , {timestamps: true});

testSchema.methods.generateAccessToken = async function(){
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

testSchema.methods.generateRefreshToken = async function(){
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

export const test = mongoose.model("test" , testSchema);