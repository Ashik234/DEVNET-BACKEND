const express=require("express")
const { UserReg, UserLogin,UserGoogleReg, UserGoogleLogin } = require("../controllers/userController")
const router = express.Router()

router.post('/register', UserReg)
router.post('/googleRegister',UserGoogleReg)
router.post('/login', UserLogin)
router.post('/googleLogin',UserGoogleLogin)

module.exports = router 