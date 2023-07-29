const express=require("express")
const { adminLogin, isAdminAuth, userDetails, eventDetails, communityDetails, userAction, eventAction, communityAction } = require("../controllers/adminController")
const { adminAuthentication } = require("../Middlewares/adminAuth")
const router = express.Router()

router.post("/login",adminLogin)
router.get("/adminAuth",adminAuthentication,isAdminAuth)
router.get("/users",adminAuthentication,userDetails)
router.get("/events",adminAuthentication,eventDetails)
router.get("/communities",adminAuthentication,communityDetails)
router.get("/useraction/:id",adminAuthentication,userAction)
router.get("/eventaction/:id",adminAuthentication,eventAction)
router.get("/communityaction/:id",adminAuthentication,communityAction)

module.exports = router