const express=require("express")
const { UserReg, UserLogin,UserGoogleReg, UserGoogleLogin, verification } = require("../controllers/userController")
const router = express.Router()

router.post('/register', UserReg)
router.post('/googleRegister',UserGoogleReg)
router.post('/login', UserLogin)
router.post('/googleLogin', UserGoogleLogin)
router.get("/:id/verify/:token",verification)

module.exports = router 