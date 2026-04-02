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
    members: [
  {
    user: mongoose.Schema.Types.ObjectId,
    role: {
      type: String,
      enum: ["admin", "editor", "viewer"],
    },
  }
]
} , {timestamps: true});

export const Collection = mongoose.model("Collection" , CollectionSchema);