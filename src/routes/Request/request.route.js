import { Router } from "express";
import { verifyJwt } from "../../middlewares/auth.middleware.js";
import { createRequest, getAllRequests } from "../../controllers/requests/request.controller.js";

const router = Router();

router.route("/testrequest").get((req,res)=>{
    res.status(200).json({
        success: true,
        message: "Request route done !!"
    })
})

router.route("/createRequest").post(
    verifyJwt,
    createRequest
)

router.route("/getAllRequests/:collectionId").get(
    verifyJwt,
    getAllRequests
)

export default router