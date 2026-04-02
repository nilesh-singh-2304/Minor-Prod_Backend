import express , {urlencoded} from "express";
import testRoute from "./routes/test.routes.js";
import userRoute from "./routes/User/user.route.js";
import requestRoute from "./routes/Request/request.route.js"
import collectionRoute from "./routes/Collection/collection.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
     origin: ["http://localhost:5173" , "https://s2m9hhsp-5173.inc1.devtunnels.ms"], 
     credentials: true,    
}));

app.use(urlencoded({extended:true}));

app.use(express.json({limit:"20kb"}));

app.use(express.static("public"));

app.use(cookieParser());

//import the routes here

app.use("/api/v1",testRoute);
app.use("/api/v1/user",userRoute);
app.use("/api/v1/collection",collectionRoute);
app.use("/api/v1/request",requestRoute);

export default app;