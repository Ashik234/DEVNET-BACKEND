const express=require("express")
const { adminLogin, isAdminAuth } = require("../controllers/adminController")
const { adminAuthentication } = require("../Middlewares/adminAuth")
const router = express.Router()

router.post("/login",adminLogin)
router.get("/adminAuth",adminAuthentication,isAdminAuth)

module.exports = router