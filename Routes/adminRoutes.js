const express=require("express")
const { adminLogin, isAdminAuth, userDetails, eventDetails, communityDetails, userAction, eventAction, communityAction } = require("../controllers/adminController")
const { adminAuthentication } = require("../Middlewares/adminAuth")
const router = express.Router()

router.post("/login",adminLogin)
router.get("/adminAuth",adminAuthentication,isAdminAuth)
router.get("/users",userDetails)
router.get("/events",eventDetails)
router.get("/communities",communityDetails)
router.get("/useraction/:id",userAction)
router.get("/eventaction/:id",eventAction)
router.get("/communityaction/:id",communityAction)

module.exports = router