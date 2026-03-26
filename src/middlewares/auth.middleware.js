import { test } from "../models/test.models.js";
import { User } from "../models/User/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";


export const verifyJwt = asyncHandler(async(req , res , next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer " , "");
        console.log("Token from middleware:", token); // Debugging log

        if(!token){
            throw new ApiError(401 , "Unauthorized: No token provided");
        }

        const decodedToken = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken._id).select("-password -refreshToken");

        if(!user){
            throw new ApiError(401 , "Unauthorized: Invalid token");
        }

        req.user = user; //to use in further request handling in controllers
        next();
    } catch (error) {
        throw new ApiError(401 , error.message || "Unauthorized: Invalid token");
    }
})