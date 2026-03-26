import mongoose from "mongoose";
import { HTTP_METHODS } from "../../../constants.js";

const RequestSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    url:{
        type: String,
        required: true,
    },
    method: {
        type: String,
        required: true,
        enum: HTTP_METHODS
    },
    headers: {
        type: Map,
        of: String,
        default: {},
    },
    queryParams: {
        type: Map,
        of: String,
        default: {},
    },
    collection: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Collection"
    }
} , {timestamps: true});

export const Request = mongoose.model("Request" , RequestSchema);