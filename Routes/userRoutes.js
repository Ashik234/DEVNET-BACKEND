const express = require("express");
const {
  UserReg,
  UserLogin,
  UserGoogleReg,
  UserGoogleLogin,
  verification,
  isUserAuth,
} = require("../controllers/userController");
const {
  askQuestion,
  getQuestions,
  getSingleQuestion,
  answerQuestion,
  saveQuestion,
  getSavedQuestions,
  searchQuestions,
} = require("../controllers/questionController");
const {
  createCommunity,
  getCommunity,
  getSingleCommunity,
  joinCommunity,
} = require("../controllers/communityController");

const { createEvent, getEvents, getSingleEvent } = require("../controllers/eventController");
const { userAuthentication } = require("../Middlewares/userAuth");
const upload = require("../Middlewares/multer");
const router = express.Router();

router.post("/register",UserReg);
router.post("/googleRegister",UserGoogleReg);
router.post("/login",UserLogin);
router.post("/googleLogin",UserGoogleLogin);
router.get("/:id/verify/:token",verification);
router.get("/userAuth",userAuthentication,isUserAuth);
router.get("/questions",userAuthentication,getQuestions);
router.post("/save/:id",userAuthentication,saveQuestion)
router.get("/savedquestions/:id",userAuthentication,getSavedQuestions)
router.get("/viewquestion/:id",userAuthentication, getSingleQuestion);
router.post("/ask",userAuthentication, askQuestion);
router.post("/answer/:id",userAuthentication, answerQuestion);
router.get("/searchquestions",userAuthentication,searchQuestions)
router.post(
  "/createcommunity/:id",
  upload.single("image"),
  userAuthentication,
  createCommunity
);
router.get("/communities", userAuthentication, getCommunity);
router.get("/viewcommunity/:id", userAuthentication, getSingleCommunity);
router.post("/join/:id", userAuthentication, joinCommunity);
router.post("/create/:id",userAuthentication,createEvent)
router.get("/events/:id",userAuthentication,getEvents)
router.get("/viewevent/:id",userAuthentication,getSingleEvent)
 
module.exports = router;
