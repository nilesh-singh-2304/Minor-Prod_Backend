// import { request } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/apiError.js";
import { Collection } from "../../models/Collections/collection.model.js";
import { Request } from "../../models/Collections/requests.model.js";
import { ApiResponse } from "../../utils/apiResponse.js";


const createRequest = asyncHandler(async(req,res) => {
    const {name , url , method , headers , queryParams , collectionId , body} = req.body;
    // const {collectionId} = req.params;
    console.log("credentials are : " , name , url , method , headers , queryParams , collectionId , body);
    

    if(!collectionId){
        throw new ApiError(400 , "Collection ID is required");
    }


    if(!url || !method || !name){
        throw new ApiError(400 , "Url , method and collection are required fields");
    }

    //checking if collection exist and belong to user
    const collection = await Collection.findOne({
        _id: collectionId,
        user: req.user?._id
    })

    if(!collection){
        throw new ApiError(400 , "Collection with this name does not exist");
    }

    const newRequest = await Request.create({
        name , 
        url , 
        method,
        headers : headers || {},
        queryParams: queryParams || "",
        body: body,
        collection: collectionId,
        user: req.user?._id
    })

    return res
           .status(200)
           .json(
                new ApiResponse(200 , newRequest , "New Request is Successfully saved")
           )
})

const getAllRequests = asyncHandler(async(req,res)=>{
    const {collectionId} = req.params;

    if(!collectionId){
        throw new ApiError(400 , "Provide collection ID");
    }

    const coll = await Collection.findOne({
        user: req.user?._id,
        _id: collectionId
    })


    if(!coll){
        throw new ApiError(400 , "No such collection exists");
    }

    const allRequests = await Request.find({
        collection: collectionId
    })

    return res
           .status(200)
           .json(
                new ApiResponse(200 , allRequests , "All requests fetched")
           )
})

export {createRequest , getAllRequests}