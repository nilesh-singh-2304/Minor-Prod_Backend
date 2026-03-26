import { Collection } from "../../models/Collections/collection.model.js";
import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";


const createCollection = asyncHandler(async(req,res) => {
    const { name , baseUrl } = req.body;
    const userId = req.user._id;

    if([name,baseUrl].some((field) => field.trim() === "")){
        throw new ApiError(400 , "Name and baseUrl are required");
    }

    if(!userId){
        throw new ApiError(401 , "Unauthorized: User not authenticated");
    }

    const isExistingCollection = await Collection.findOne(
        {
            name: name.toLowerCase(),
            user: userId
        }
    );

    if(isExistingCollection){
        throw new ApiError(409 , "Collection with the same name already exists for this user");
    }

    const collection = await Collection.create({
        name: name.toLowerCase(),
        baseUrl,
        user: userId
    });

    return res
        .status(201)
        .json(
            new ApiResponse(200 , collection , "Collection created successfully")
        )
})

const getAllCollections = asyncHandler(async(req,res) => {
    const userId = req.user._id;

    if(!userId){
        throw new ApiError(401 , "Unauthorized: User not authenticated");
    }

    const collections = await Collection.find(
       { user: userId}
    );

    return res
           .status(200)
           .json(
            new ApiResponse(200 , collections , "All collections of user fetched")
           )
})

export {createCollection , getAllCollections};