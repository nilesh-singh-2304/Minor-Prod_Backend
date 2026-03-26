import app from "./app.js";
import dotenv from "dotenv"
import connectDB from "./DB/connectDB.js";

dotenv.config({path: "./.env"});

const PORT = 8000;

connectDB().then(() => {
    app.on("error" , () => {
        console.log("Error in server connection : " , err);
        throw error;
        
    })

    app.listen(PORT , () => {
        console.log(`Server is running on port ${PORT}`);
    })
})
.catch((error) => {
    console.log("DB connection failed" , error);
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});