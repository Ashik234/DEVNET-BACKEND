const express = require("express");
const {
  UserReg,
  UserLogin,
  UserGoogleReg,
  UserGoogleLogin,
  verification,
  isUserAuth,
  userGetDetails,
  getSingleUser,
  editProfile,
} = require("../controllers/userController");
const {
  askQuestion,
  getQuestions,
  getSingleQuestion,
  answerQuestion,
  saveQuestion,
  getSavedQuestions,
  searchQuestions,
  verifiedAnswer,
  getAskedQuestions,
} = require("../controllers/questionController");
const {
  createCommunity,
  getCommunity,
  getSingleCommunity,
  joinCommunity,
} = require("../controllers/communityController");

const {
  createEvent,
  getEvents,
  getSingleEvent,
  getAllEvents,
} = require("../controllers/eventController");
const { userAuthentication } = require("../Middlewares/userAuth");
const upload = require("../Middlewares/multer");
const {
  createChat,
  userChat,
  findChat,
} = require("../controllers/chatController");
const { addMessage, getMessages } = require("../controllers/messageController");
const {
  addChat,
  getAllMessage,
} = require("../controllers/discussionController");
const router = express.Router();

router.post("/register", UserReg);
router.post("/googleRegister", UserGoogleReg);
router.post("/login", UserLogin);
router.post("/googleLogin", UserGoogleLogin);
router.get("/:id/verify/:token", verification);
router.get("/userAuth", userAuthentication, isUserAuth);
router.post("/usergetdetails/:userId", userAuthentication, userGetDetails);
router.get("/questions", userAuthentication, getQuestions);
router.post("/save/:id", userAuthentication, saveQuestion);
router.get("/savedquestions/:id", userAuthentication, getSavedQuestions);
router.get("/askedquestions/:id", userAuthentication, getAskedQuestions);
router.get("/viewquestion/:id", userAuthentication, getSingleQuestion);
router.post("/ask", userAuthentication, askQuestion);
router.post("/answer/:id", userAuthentication, answerQuestion);
router.post("/verified/:id", userAuthentication, verifiedAnswer);
router.get("/searchquestions", userAuthentication, searchQuestions);
router.post(
  "/createcommunity/:id",
  upload.single("image"),
  userAuthentication,
  createCommunity
);
router.get("/communities", userAuthentication, getCommunity);
router.get("/viewcommunity/:id", userAuthentication, getSingleCommunity);
router.post("/join/:id", userAuthentication, joinCommunity);
router.post(
  "/create/:id",
  upload.single("image"),
  userAuthentication,
  createEvent
);
router.get("/events", userAuthentication, getAllEvents);
router.get("/events/:id", userAuthentication, getEvents);
router.get("/viewevent/:id", userAuthentication, getSingleEvent);

router.post("/createchat", userAuthentication, createChat);
router.get("/getchat/:userId",userAuthentication, userChat);
router.get("/findchat/:firstId/:secondId", userAuthentication,findChat);

router.post("/addmessage",userAuthentication, addMessage);
router.get("/getmessages/:chatId",userAuthentication, getMessages);

router.post("/addchat", userAuthentication, addChat);
router.get("/getallmessages/:id", userAuthentication, getAllMessage);

module.exports = router;
