import { Router } from "express";
import { addMembersWithRole, createCollection, getAllCollections, getCollectionsWithRequests } from "../../controllers/collections/collection.controller.js";
import { verifyJwt } from "../../middlewares/auth.middleware.js";

const router = Router();

router.route("/testcoll").get((req,res) => {
    res.status(200).json({
        success:true,
        message:"test route is working fine"
    })
})

router.route("/createCollection").post(
    verifyJwt,
    createCollection
)

router.route("/getAllCollections").get(
    verifyJwt,
    getAllCollections
)

router.route("/collections-with-requests").get(
    verifyJwt,
    getCollectionsWithRequests
)

router.route("/add-members").post(
    verifyJwt,
    addMembersWithRole
)

export default router;