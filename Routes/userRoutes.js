const express = require("express");
const {
  UserReg,
  UserLogin,
  UserGoogleReg,
  UserGoogleLogin,
  verification,
  isUserAuth,
} = require("../controllers/userController");
const {askQuestion,getQuestions, getSingleQuestion, answerQuestion} = require("../controllers/questionController")
const {createCommunity, getCommunity, getSingleCommunity, joinCommunity} = require("../controllers/communityController")

const { userAuthentication } = require("../Middlewares/userAuth");
const upload = require("../Middlewares/multer")
const router = express.Router();

router.post("/register", UserReg);
router.post("/googleRegister", UserGoogleReg);
router.post("/login", UserLogin);
router.post("/googleLogin", UserGoogleLogin);
router.get("/:id/verify/:token", verification);
router.get("/userAuth",userAuthentication,isUserAuth)
router.get("/questions",getQuestions)
router.get("/viewquestion/:id",userAuthentication,getSingleQuestion)
router.post("/ask",userAuthentication,askQuestion)
router.post("/answer/:id",userAuthentication,answerQuestion)
router.post("/createcommunity/:id",upload.single("image"),userAuthentication,createCommunity)
router.get("/communities",userAuthentication,getCommunity)
router.get("/viewcommunity/:id",userAuthentication,getSingleCommunity)
router.post("/join/:id",userAuthentication,joinCommunity)


module.exports = router;
