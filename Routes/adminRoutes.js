const express=require("express")
const { adminLogin, isAdminAuth, userDetails, eventDetails, communityDetails, userAction, eventAction, communityAction, reportDetails, reportAction, addArticle, articleDetails, articleAction, userCount, reportCount, getArticles, editArticle } = require("../controllers/adminController")
const { adminAuthentication } = require("../Middlewares/adminAuth")
const router = express.Router()
const upload = require("../Middlewares/multer");

router.post("/login",adminLogin)
router.get("/adminAuth",adminAuthentication,isAdminAuth)
router.get("/usercount",adminAuthentication,userCount)
router.get("/reportcount",adminAuthentication,reportCount)
router.get("/users",adminAuthentication,userDetails)
router.get("/events",adminAuthentication,eventDetails)
router.get("/communities",adminAuthentication,communityDetails)
router.post("/addarticle",upload.single("image"),adminAuthentication,addArticle)
router.post("/editarticle/:id",upload.single("image"),adminAuthentication,editArticle)
router.get("/articles",adminAuthentication,articleDetails)
router.get("/reports",adminAuthentication,reportDetails)
router.get("/useraction/:id",adminAuthentication,userAction)
router.get("/eventaction/:id",adminAuthentication,eventAction)
router.get("/communityaction/:id",adminAuthentication,communityAction)
router.get("/articleaction/:id",adminAuthentication,articleAction)
router.get("/reportaction/:id",adminAuthentication,reportAction)

module.exports = router