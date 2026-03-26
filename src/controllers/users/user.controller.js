import { Collection } from "../../models/Collections/collection.model.js";
import { User } from "../../models/User/user.model.js";
import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";


const RegisterUser = asyncHandler(async(req , res) => {
    const {name , username , email , password} = req.body;

    if([name , username , email , password].some((field) => field?.trim() === "")){
        throw new ApiError(400 , "All fields are required")
    }

    const isExisting = await User.findOne({
        $or : [
            {email}
        ]
    })

    console.log("Existing user is : " , isExisting);
    

    if(isExisting){
        throw new ApiError(409 , "User with the provided email or username already exists");
    }

    const user = await User.create({
        name,
        username,
        email,
        password
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if(!createdUser){
        throw new ApiError(500 , "Failed to create user");
    }

    return res.status(201).json(
        new ApiResponse(200 , createdUser , "User registered successfully")
    )


})

const generateTokens = async(userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});

        return {
            accessToken,
            refreshToken
        }
    } catch (error) {
        throw new ApiError(500 , error.message || "An error occurred while generating tokens");
    }
}

const loginUser = asyncHandler(async(req , res) => {
    const { email , password } = req.body;

    if([email , password].some((field) => field?.trim() === "")){
        throw new ApiError(400 , "Email and password are required");
    }

    const user = await User.findOne({ email });

    if(!user){
        throw new ApiError(404 , "User with the provided email not found");
    }

    const isPasswordValid = await user.checkPassword(password);

    if(!isPasswordValid){
        throw new ApiError(401 , "Invalid password");
    }

    const {accessToken , refreshToken} = await generateTokens(user._id);

    const loggedUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true,
    }

    return res
           .status(200)
           .cookie("accessToken" , accessToken , options)
           .cookie("refreshToken" , refreshToken , options)
           .json(
            new ApiResponse(200 , {
                user: loggedUser,
                accessToken: accessToken,
                refreshToken: refreshToken
            } , "User logged in successfully")
           );
})

const logoutUser = asyncHandler(async(req,res) => {
    const userId = req?.user?._id;

    await User.findByIdAndUpdate(
        userId,
        {
            $set:{
                refreshToken : undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
           .status(200)
           .clearCookie("accessToken" , options)
           .clearCookie("refreshToken" , options)
           .json(
            new ApiResponse(200 , null , "User logged out successfully")
           )
})

const getUser =asyncHandler(async(req,res) => {
    const user = req.user;

    return res
           .status(200)
           .json(
                new ApiResponse(200 , user , "User details fetched successfully")
           );
})

const getUserCollections = asyncHandler(async(req,res) => {
    const {username} = req.params;

    if(!username.trim()){
        throw new ApiError(400 , "Username is required");
    }

    const collections = await User.aggregate([
        {
            $match:{
                username: username.toLowerCase()
            },
        },
        {
            $lookup:{
                from: "collections",
                localField: "_id",
                foreignField: "user",
                as: "collections"
            }
        },
        {
            $addFields: {
                totalCollections: {$size: "$collections"}
            }
        },
        {
            $project: {
                name: 1,
                username: 1,
                email: 1,
                totalCollections: 1,
                collections: 1,
            }
        }
    ])

    if(!collections?.length){
        throw new ApiError(404 , "User not found");
    }

    return res
           .status(200)
           .json(
                new ApiResponse(200 , collections[0] , "User collections fetched successfully")
           )
})

export {RegisterUser , loginUser , logoutUser , getUser , getUserCollections};