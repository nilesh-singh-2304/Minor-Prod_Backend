import mongoose from "mongoose";
import { DB_NAME } from "../../constants.js";

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}?authSource=admin`)
        // console.log("DB connected : " , connection);
        
    } catch (error) {
        console.log("DB connection failed" , error);
        process.exit(1);
    }
}

export default connectDB;