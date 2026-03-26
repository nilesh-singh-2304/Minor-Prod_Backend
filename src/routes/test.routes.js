import { Router } from "express";
import { insertTestData, testLogin } from "../controllers/test/test.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { ApiResponse } from "../utils/apiResponse.js";


const router = Router();

router.route("/test").get((req,res)=>{
    res.status(200).json({
        success:true,
        message:"test route is working fine"
    })
})

router.route("/insert").post(
    insertTestData
)

router.route("/insert1").get(
    verifyJwt,
    (req, res) => {
        res.status(200).json(
            new ApiResponse(200, null, "Protected route accessed successfully")
        );
    }
);

router.route("/login").post(
    testLogin
)

export default router;