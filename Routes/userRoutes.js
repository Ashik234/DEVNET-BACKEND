const express = require("express");
const {
  UserReg,
  UserLogin,
  UserGoogleReg,
  UserGoogleLogin,
  verification,
  isUserAuth,
} = require("../controllers/userController");
const {askQuestion,getQuestions, getSingleQuestion} = require("../controllers/questionController")

const { userAuthentication } = require("../Middlewares/userAuth");
const router = express.Router();


router.post("/register", UserReg);
router.post("/googleRegister", UserGoogleReg);
router.post("/login", UserLogin);
router.post("/googleLogin", UserGoogleLogin);
router.get("/:id/verify/:token", verification);
router.get("/userAuth",userAuthentication,isUserAuth)
router.get("/questions",getQuestions)
router.get("/viewquestion/:id",getSingleQuestion)
router.post("/ask",userAuthentication,askQuestion)


module.exports = router;
