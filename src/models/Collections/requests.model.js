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
    body: {
        type: mongoose.Schema.Types.Mixed,
        default: null,
    },
    collection: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Collection"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
} , {timestamps: true});

export const Request = mongoose.model("Request" , RequestSchema);