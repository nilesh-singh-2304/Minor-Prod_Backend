import { Router } from "express";
import { verifyJwt } from "../../middlewares/auth.middleware.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { getUserCollections, loginUser, RegisterUser } from "../../controllers/users/user.controller.js";

const router = Router();

router.route("/testuser").get((req,res) => {
    res.status(200).json({
        success:true,
        message:"test route is working fine"
    })
})

router.route("/register").post(
    RegisterUser
)

router.route("/login").post(
    loginUser
)

router.route("/getcoll/:username").get(
    verifyJwt,
    getUserCollections
)

export default router;