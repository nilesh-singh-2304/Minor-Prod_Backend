import mongoose from "mongoose";

const CollectionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    baseUrl: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
} , {timestamps: true});

export const Collection = mongoose.model("Collection" , CollectionSchema);